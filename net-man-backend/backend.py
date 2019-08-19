#!flask/bin/python

from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from mininet.topo import Topo, LinearTopo, SingleSwitchTopo
from mininet.topolib import TreeTopo
from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch
from mininet.clean import Cleanup
from functools import partial
from mininet.util import dumpNodeConnections


import logging
# from flask import response

# from functools import partial
import networkx as nx

from flask import Flask, jsonify, request ,make_response
from flask_cors import CORS

import requests
import json
import httplib2

from gevent.pywsgi import WSGIServer

app = Flask(__name__)
cors = CORS(app)

gnet = None

gflows_list = []
gshortest_path = []




def createNet(controllerIp, controllerPort, topoType,
        switchType, nodesPerSwitch, switchNum, mac):
    "Bootstrap a Mininet network using the Minimal Topology"

    # Create an instance of our topology
    #topo = MinimalTopo()

    topo = None
    if topoType == 'linear':
        topo = LinearTopo(k=switchNum, n=nodesPerSwitch)
    elif topoType == 'tree':
        topo = TreeTopo(depth=switchNum, fanout=nodesPerSwitch)

    switch = None
    if switchType == 'OVSSwitch':
        switch = partial( OVSSwitch, protocols='OpenFlow13' )
    elif switchType == 'OVSKernelSwitch':
        switch = partial( OVSKernelSwitch, protocols='OpenFlow13' )

    controller = None
    if controllerPort == 'default':
        controller = lambda name: RemoteController( name, ip=controllerIp )
    else:
        intPort = int(controllerPort)
        controller = lambda name: RemoteController( name, ip=controllerIp, port=intPort )

    # Create a network based on the topology using OVS and controlled by
    # a remote controller.
    net = Mininet(
        topo=topo,
        controller=controller,
        switch=switch,
        autoSetMacs=mac,
        waitConnected=True,
    )

    # Actually start the network
    net.start()
    dumpNodeConnections(net.hosts)
    # net.pingAll()

    # Drop the user in to a CLI so user can run commands.
    # CLI( net )

    # Export local net
    global gnet
    gnet = net

    global gflows_list
    global gshortest_path


# @app.route('/')
# def index():
#     return "Hello, World!"


@app.route('/network', methods=['POST'])
def create_network():
    # Get request data
    ip = request.json.get('ip')
    if ip == 'localhost':
        ip = '127.0.0.1'

    port = request.json.get('port')
    mac = request.json.get('mac')
    if mac == 'true':
        mac = True
    elif mac == 'false':
        mac = False

    topoType = request.json.get('topoType')
    switchType = request.json.get('switchType')
    switchNum = int( request.json.get('switchNum') )
    nodesPerSwitch = int( request.json.get('nodesPerSwitch') )

    # Create Network
    createNet(ip, port, topoType, switchType, nodesPerSwitch,
            switchNum, mac)

    return jsonify({'msg': 'Network Created'})


@app.route('/network', methods=['DELETE'])
def delete_network():
    print 'deleted network'
    global gnet
    if gnet is not None:
        gnet.stop()
        #Cleanup.cleanup()
        gnet = None
        return jsonify({'msg': 'Network Stopped'})
    else:
        return jsonify({'msg': 'Network Already Stopped'})

@app.route('/network', methods=['GET'])
def network_exists():
    print 'exists?'
    print gnet
    if gnet == None:
        return jsonify({'status': 'down'})
    else:
        return jsonify({'status': 'up'})





@app.route('/shortest_path', methods=['POST'])
def find_shortest_path():
    if gnet == None:
        return jsonify({'status': 'down'})

    # content = request.json
    # print content['mytext']
    graph = nx.Graph()

    links_list = request.json.get('links')

    # print links_list

    for link in links_list:
        e = (link[0],link[1])
        graph.add_edge(*e)

    # print graph.edges()

    nodes_list = request.json.get('nodes')

    for node in nodes_list:
        graph.add_node(node)

    node_src = request.json.get('node_source')
    node_dest = request.json.get('node_dest')
    shortest_path = nx.shortest_path(graph, node_src, node_dest)

    gshortest_path = shortest_path #make list global
    # shortest_path.reverse()

    # print shortest_path

    return jsonify({'shortest_path': shortest_path})


@app.route('/shortest_path', methods=['GET'])
def get_shortest_path():
    return  jsonify({'shortest_path': gshortest_path})


@app.route('/flows', methods=['DELETE'])
def delete_flows():
    for url in gflows_list:
        delete_flow(url)

    del gshortest_path[:]   # delete shortest path list
    del gflows_list[:]      # delete all urls from global list
    return jsonify({'success': True})

def delete_flow(url):
    response = requests.delete(url, headers={'Accept': 'application/json','Authorization': 'Basic YWRtaW46YWRtaW4='})




@app.route('/flows', methods=['POST'])
def create_flows():
    content_json = request.get_json()
    print 'Did I receive json format? [{}] --> Content is {} years old'. format(request.is_json, content_json)

    src_mac_address  = content_json['srcMacAddress']
    dest_mac_address = content_json['destMacAddress']

    nodes_info       = content_json['nodesInfo']

    for switch_info in nodes_info:
        switch_id    = switch_info['switchId'] # openflow:<number>
        port_number  = str(switch_info['portNumber'])
        table_id     = str(switch_info['tableId'])
        flow_id      = '0'

        response_from_odl = create_flow(switch_id, table_id, flow_id, src_mac_address, dest_mac_address,port_number)


    # todo here check if flows exist!!

    return jsonify({'success': True})



def create_flow(openflow_id,table_id,flow_id,src_mac_address,dest_mac_address,port_number):

    flow_dict = {'flow': [{
        'id': flow_id,
        'match': {'ethernet-match':{'ethernet-source':{'address': src_mac_address}, 'ethernet-destination':{'address': dest_mac_address}, 'ethernet-type':{'type': '0x800'} }},
        'instructions': {'instruction': [ { 'apply-actions':{'action': [{'output-action':{'output-node-connector':port_number} , 'order': '1' }] } ,'order':'1'}]  },
        'installHw':'false',
        'table_id':table_id }]}

    #e.g http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:1/table/2/flow/0
    h = httplib2.Http(".cache")
    h.add_credentials('admin', 'admin')

    url_to_send_to_odl = "http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/"+str(openflow_id)+"/table/"+str(table_id)+"/flow/"+str(flow_id)
    print url_to_send_to_odl
    gflows_list.append(url_to_send_to_odl)


    # monitor json that we send to odl
    with open('diagnostics/requestsToODL.json',mode='a+') as json_file:
        json_file.write(json.dumps(flow_dict, json_file))
    json_file.close()

    # response = requests.put(url_to_send_to_odl, json=json.dumps(flow_dict) ,

    resp, content = h.request(
          uri = url_to_send_to_odl,
          method = 'PUT',
          headers={'Content-Type' : 'application/json'},
          body=json.dumps(flow_dict)
        )

    # monitor json that we receive from odl
    with open('diagnostics/responsesFromODL.json',mode='a+') as json_file2:
        json_file2.write(json.dumps(resp, json_file2))
    json_file2.close()


    # return  response
    # return make_response(jsonify(content), resp)
    return jsonify({'success': True})



# https://realpython.com/python-requests/
@app.route('/hello', methods=['GET'])
def hello():

    response = requests.get(
        'http://localhost:8181/restconf/operational/network-topology:network-topology',
        # params={'q': 'requests+language:python'},
        headers={'Accept': 'application/json','Authorization': 'Basic YWRtaW46YWRtaW4='},
    )

    return response.json()


@app.route('/pingall', methods=['POST'])
def pingall():
    gnet.pingAll()
    return jsonify({'success': True})


@app.route('/ping_hosts', methods=['POST'])
def ping_between_hosts():

    # h_src = gshortest_list[0]
    # h_dest= gshortest_list[-1]
    # print 'h_src = [{}] & h_dest = {}  .'. format(h_src, h_dest)
    # gnet.ping(h_src,h_dest)

    # gnet.ping('h1','h2')

    print gnet.hosts

    #startpings( host, ips )
    # h_source, h_dest  = gnet.hosts[index_src], gnet.hosts[index_dest]

    # xrono prin [check if exists if not calculate it]
    # xrono meta
    # diafora
    # poso xrono pio grhgoro %

    # print h_source.cmd('ping -c50 %s' % h_dest.IP()
    # print h1.cmd( 'ping -c1', h2.IP() )
    # return jsonify({'success': True})




# domh list/dict na krataei ola ta dhmiourgithenta flows
#delete endpoint gia to flow
#delete all flows





if __name__ == '__main__':
    # app.run(debug=True)
    http_server = WSGIServer(('', 5000), app)
    print "INFO: Server Started!"
    http_server.serve_forever()
