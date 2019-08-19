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

gstats_list=[]



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
    global gstats_list


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



@app.route('/shortest_path', methods=['DELETE'])
def delete_shortest_path():
    global gshortest_path
    del gshortest_path[:]   # delete shortest path list
    return jsonify({'success': True})


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

    global gshortest_path
    gshortest_path = shortest_path #make list global
    # shortest_path.reverse()

    # print shortest_path

    return jsonify({'shortest_path': gshortest_path})


@app.route('/shortest_path', methods=['GET'])
def get_shortest_path():
    return  jsonify({'shortest_path': gshortest_path})


@app.route('/flows', methods=['DELETE'])
def delete_flows():
    global gshortest_path
    global gflows_list
    global gstats_list

    for url in gflows_list:
        delete_flow(url)

    print 'before ::'+ str(gshortest_path)

    del gshortest_path[:]   # delete shortest path list
    print 'after ::'+ str(gshortest_path)

    print 'before ::'+ str(gflows_list)

    del gflows_list[:]      # delete all urls from global list

    print 'after ::'+ str(gflows_list)

    del gstats_list[:]

    return jsonify({'success': True})

def delete_flow(url):
    response = requests.delete(url, headers={'Accept': 'application/json','Authorization': 'Basic YWRtaW46YWRtaW4='})



# {
#     success: true,
#     sourceDest: {
#         timeBefore: <val>,
#         timeAfter: <val>,
#         timeDiff: <val>,
#         timeDiffPrc: <val>
#     },
#
#     destSource: {
#         timeBefore: <val>,
#         timeAfter: <val>,
#         timeDiff: <val>,
#         timeDiffPrc: <val>
#     }
# }

@app.route('/flows', methods=['GET'])
def stat_flows():
    if len(gstats_list) is not 2:
        return jsonify({'success': False})

    return stats()


def stats():
    time_before   = gstats_list[0]
    time_after    = gstats_list[1]
    time_diff     = time_before - time_after
    time_diff_prc = ((time_before - time_after)/time_after)*100 #following formula  (y2 - y1) / y1)*100,where time_before=y2 time_after=y1

    print 'time_before [{}] & time_after {} years old'. format(time_before, time_after)


    stats_dict  = {'sourceDest':{'timeBefore': str(time_before),'timeAfter':str(time_after),'timeDiff':str(time_diff),'timeDiffPrc':str(time_diff_prc)}  ,'success': True}

    return json.dumps(stats_dict)




@app.route('/flows', methods=['POST'])
def create_flows():
    global gstats_list
    # call ping_between_hosts_and_get_avrg_time() without flows
    time_without_flows =ping_between_hosts_and_get_avrg_time()
    gstats_list.append(float(time_without_flows)) #store in gstats_list[0] the avrg time before setting the flows

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
    # call ping_between_hosts_and_get_avrg_time() with the flows
    time_with_flows =ping_between_hosts_and_get_avrg_time()
    gstats_list.append(float(time_with_flows)) #store in gstats_list[1] the avrg time before setting the flows

    return stats()



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

    # monitor urls that we send to odl
    with open('diagnostics/urls.txt',mode='a+') as urls_file:
        urls_file.write(url_to_send_to_odl)
    urls_file.close()

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

    #send get in odl in 8181 to test the flow exists!
    # if (flow_exists()):
    #     pass

    return jsonify({'success': True})


def flow_exists():
    pass

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


# @app.route('/ping_hosts', methods=['POST'])
def ping_between_hosts_and_get_avrg_time():
    # global gshortest_path

    h_src_name = gshortest_path[0]
    h_dest_name= gshortest_path[-1]
    h_src_id ,h_dest_id= "0x"+ h_src_name[-2:] ,"0x"+ h_dest_name[-2:]
    print 'h_src_id = [{}] & h_dest_id = {}  .'. format(h_src_id, h_dest_id)

    h_src_suffix , h_dest_suffix = int(h_src_id, 16) ,int(h_dest_id, 16) #hex(int(h_src_id, 16)),hex(int(h_dest_id, 16))     #convert hex string to hex number

    print 'h_src_suffix = [{}] & h_dest_suffix = {}  .'. format(h_src_suffix, h_dest_suffix)

    h_src, h_dest  = gnet.getNodeByName('h'+ str(h_src_suffix)), gnet.getNodeByName('h'+str(h_dest_suffix)) # to thelei h1 hf h9
    print 'h_src = [{}] & h_dest = {}  '. format(h_src, h_dest)




    # test = gnet.ping(h_src,h_dest)
    # print test

    # gnet.ping(h_src,h_dest)

    # print gnet.hosts

    #startpings( host, ips )

    # xrono prin [check if exists if not calculate it]
    # xrono meta
    # diafora
    # poso xrono pio grhgoro %

    test_ping = h_src.cmd('ping -c10 %s' % h_dest.IP())
    print test_ping

    # print test_ping.split('')
    print "AFTER SPLITTING ~~~~~~~~~~~~~~~~~~~"

    avrgStats = test_ping.split("ping statistics",1)[1]
    print avrgStats

    print "AFTER 2ND SPLITTING ~~~~~~~~~~~~~~~~~~~"

    split2 = avrgStats.split("/")
    print split2
    # thelw 4
    avrgTime = split2[4]
    print avrgTime
    print 'avrgTime =[{}]'. format(avrgTime)

    return avrgTime


# [' ---\r\n10 packets transmitted, 10 received, 0% packet loss, time 9193ms\r\nrtt min', 'avg', 'max', 'mdev = 0.091', '0.190', '0.939', '0.250 ms\r\n']


    # print h1.cmd( 'ping -c1', h2.IP() )
    # return jsonify({'success': True})
    # return jsonify({'success': True})




# /flows GET




if __name__ == '__main__':
    # app.run(debug=True)
    http_server = WSGIServer(('', 5000), app)
    print "INFO: Server Started!"
    http_server.serve_forever()
