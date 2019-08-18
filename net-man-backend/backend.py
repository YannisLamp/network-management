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

from flask import request
import requests
# from flask import response

# from functools import partial
import networkx as nx

from flask import Flask, jsonify, request
from flask_cors import CORS

from gevent.pywsgi import WSGIServer

app = Flask(__name__)
cors = CORS(app)

gnet = None

gflows_list = None




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
    net.pingAll()

    # Drop the user in to a CLI so user can run commands.
    # CLI( net )

    # Export local net
    global gnet
    gnet = net

    global gflows_list


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

    # shortest_path.reverse()

    # print shortest_path

    return jsonify({'shortest_path': shortest_path})


@app.route('/create_flows', methods=['POST'])
def create_flow():

    #auta tha einai xwmena se lista kai tha ta kanw iterate
    switch_id        = request.json.get('switchId') # openflow:<number>
    flow_id          = request.json.get('flowId') #mporei na mh to pairnw kai na to ftiaxnw egw apo openflow<x>_myflow
    port_number      = request.json.get('portNumber')
    table_id         = request.json.get('tableId')
    

    src_mac_address  = request.json.get('srcMacAddress')
    dest_mac_address = request.json.get('destMacAddress')


    create_flow()
    # NODE_INFO = [OBJECT],OPOU OBJECT
    flows_list=[]

    # kalw epanalhptika th create flow pou ftiaxnei kai ta url

     gflows_list= flows_list


    # response = requests.post("http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:1/table/0/flow/1", json=jsonify(flow_dict))
    response = requests.get("http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:1/table/0/flow/0")
    print response

    return response
    # return jsonify({'success': True})



def create_flow(openflow_id,table_id,flow_id,src_mac_address,dest_mac_address,port_number):
    # NODE_INFO = [OBJECT],OPOU OBJECT



    flow_dict = {'flow': [{
        'id': flow_id,
        'match': {'ethernet-match':{'ethernet-source':{'address': src_mac_address}, 'ethernet-destination':{'address': dest_mac_address}, 'ethernet-type':{'type': '0x800'} }},
        'instructions': {'instruction': [ { 'apply-actions':{'action': [{'output-action':{'output-node-connector':port_number} , 'order': '1' }] } ,'order':'1'}]  },
        'installHw':'false',
        'table_id':table_id }]}

    # nested_dict = { 'dictA': {'key_1': 'value_1'},
    #             'dictB': {'key_2': 'value_2'}
    # json.dumps({'id': 5, '6': 7}, indent=4))
    # json.dumps(flow_dict, indent=4))

    print(jsonify(flow_dict))

    url_to_send_to_odl = "http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:"+openflow_id+"/table/"+table_id+"/flow/"+flow_id

    response = requests.post("http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:27/table/0/flow/1", json=jsonify(flow_dict))

    print response.json()

    return jsonify(flow_dict) #todo add sort_keys=True


# https://realpython.com/python-requests/
@app.route('/hello', methods=['GET'])
def hello():
    # response = requests.get("http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:1/table/0/flow/0")
    # print response.json()

    # return jsonify(response.json())
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
    h_source = request.json.get('H_source')
    h_dest = request.json.get('H_dest')


    gnet.ping(h_source,h_dest)
    #startpings( host, ips )
    h_source, h_dest  = gnet.hosts[index_src], gnet.hosts[index_dest]

    # xrono prin [check if exists if not calculate it]
    # xrono meta
    # diafora
    # poso xrono pio grhgoro %

    # print h_source.cmd('ping -c50 %s' % h_dest.IP()
    # return jsonify({'success': True})




# domh list/dict na krataei ola ta dhmiourgithenta flows
#delete endpoint gia to flow
#delete all flows





if __name__ == '__main__':
    # app.run(debug=True)
    http_server = WSGIServer(('', 5000), app)
    print "INFO: Server Started!"
    http_server.serve_forever()
