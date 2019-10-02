#!flask/bin/python

import json
from functools import partial

import httplib2
# from functools import partial
import networkx as nx
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from gevent.pywsgi import WSGIServer

from mininet.cli import CLI
from mininet.net import Mininet
from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch
from mininet.topo import LinearTopo
from mininet.topolib import TreeTopo
from mininet.util import dumpNodeConnections

from flask_swagger_ui import get_swaggerui_blueprint



app = Flask(__name__)
cors = CORS(app)


### swagger specific ###
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Seans-Python-Flask-REST-Boilerplate"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
### end swagger specific ###


# @app.route("/spec")
# def spec():
#     return jsonify(swagger(app))



global_net = None
gflows_list = []
gshortest_path = []
gstats_list = []


def create_net(controller_ip, controller_port, topo_type, switch_type, nodes_per_switch, switch_num, mac):
    """Bootstrap a Mininet network using the Minimal Topology"""

    # Create an instance of our topology
    if topo_type == 'tree':
        topology = TreeTopo(depth=switch_num, fanout=nodes_per_switch)
    else:
        topology = LinearTopo(k=switch_num, n=nodes_per_switch)

    if switch_type == 'OVSKernelSwitch':
        switch = partial(OVSKernelSwitch, protocols='OpenFlow13')
    else:
        switch = partial(OVSSwitch, protocols='OpenFlow13')

    if controller_port == 'default':
        controller = lambda name: RemoteController(name, ip=controller_ip)
    else:
        controller = lambda name: RemoteController(name, ip=controller_ip, port=int(controller_port))

    # Create a network based on the topology, using OVS and controlled by a remote controller.
    global global_net
    global_net = Mininet(topo=topology, controller=controller, switch=switch, autoSetMacs=mac, waitConnected=True)


def start_net(net, ping_all=False, cli=False):
    """
    Starts the network that is passed to it.
    :param net: the network to be started
    :param ping_all: after start pingAll()
    :param cli: Drop the user in to a CLI so user can run commands.
    """
    net.start()
    dumpNodeConnections(net.hosts)
    if ping_all: net.pingAll()
    if cli: CLI(net)


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
    switchNum = int(request.json.get('switchNum'))
    nodesPerSwitch = int(request.json.get('nodesPerSwitch'))

    # Create Network
    create_net(ip, port, topoType, switchType, nodesPerSwitch, switchNum, mac)
    start_net(global_net)
    return jsonify({'msg': 'Network Created'})


def clean_up_everything():
    global gshortest_path
    global gflows_list
    global gstats_list

    for url in gflows_list:
        delete_flow(url)

    del gshortest_path[:]  # delete shortest path list
    del gflows_list[:]  # delete all urls from global list
    del gstats_list[:]  # delete stats list




@app.route('/network', methods=['DELETE'])
def delete_network():
    print 'deleted network'
    global global_net
    if global_net is not None:

        clean_up_everything()   

        global_net.stop()
        # Cleanup.cleanup()
        global_net = None
        return jsonify({'msg': 'Network Stopped'})
    else:
        return jsonify({'msg': 'Network Already Stopped'})


@app.route('/network', methods=['GET'])
def network_exists():
    print 'exists?'
    print global_net
    if global_net is None:
        return jsonify({'status': 'down'})
    else:
        return jsonify({'status': 'up'})


@app.route('/shortest_path', methods=['DELETE'])
def delete_shortest_path():
    global gshortest_path
    del gshortest_path[:]  # delete shortest path list
    return jsonify({'success': True})


@app.route('/shortest_path', methods=['POST'])
def find_shortest_path():
    if global_net is None:
        return jsonify({'status': 'down'})

    graph = nx.Graph()

    links_list = request.json.get('links')

    for link in links_list:
        e = (link[0], link[1])
        graph.add_edge(*e)

    nodes_list = request.json.get('nodes')

    for node in nodes_list:
        graph.add_node(node)

    node_src = request.json.get('node_source')
    node_dest = request.json.get('node_dest')
    shortest_path = nx.shortest_path(graph, node_src, node_dest)

    global gshortest_path
    gshortest_path = shortest_path  # assign shortest_path list to our global list
    # shortest_path.reverse()

    return jsonify({'shortest_path': gshortest_path})


@app.route('/shortest_path', methods=['GET'])
def get_shortest_path():
    return jsonify({'shortest_path': gshortest_path})


@app.route('/flows', methods=['DELETE'])
def delete_flows():
    global gshortest_path
    global gflows_list
    global gstats_list

    clean_up_everything()

    if len(gshortest_path) == 0 and len(gflows_list) == 0 and len(gstats_list) == 0:
        return jsonify({'success': True})

    return jsonify({'success': False})


def delete_flow(url):
    response = requests.delete(url, headers={'Accept': 'application/json', 'Authorization': 'Basic YWRtaW46YWRtaW4='})


@app.route('/flows', methods=['GET'])
def stat_flows():
    if len(gstats_list) is not 2:
        return jsonify({'success': False})

    return stats()


def stats():
    time_before = gstats_list[0]
    time_after = gstats_list[1]
    time_diff = time_before - time_after
    time_diff_prc = ((
                             time_before - time_after) / time_after) * 100  # following formula  (y2 - y1) / y1)*100,where time_before=y2 time_after=y1

    print 'time_before [{}] & time_after [{}] years old'.format(time_before, time_after)

    stats_dict = {
        'sourceDest': {'timeBefore': str(time_before), 'timeAfter': str(time_after), 'timeDiff': str(time_diff),
                       'timeDiffPrc': str(time_diff_prc)}, 'success': True}

    return json.dumps(stats_dict)


@app.route('/flows', methods=['POST'])
def create_flows():
    global gstats_list
    # call ping_between_hosts_and_get_avrg_time() without flows
    time_without_flows = ping_between_hosts_and_get_avrg_time()
    gstats_list.append(float(time_without_flows))  # store in gstats_list[0] the avrg time before setting the flows

    content_json = request.get_json()
    print 'Did I receive json format? [{}] --> Content is [{}] '.format(request.is_json, content_json)

    src_mac_address = content_json['srcMacAddress']
    dest_mac_address = content_json['destMacAddress']

    nodes_info = content_json['nodesInfo']

    for switch_info in nodes_info:
        switch_id = switch_info['switchId']  # openflow:<number>
        port_number = str(switch_info['portNumber'])
        table_id = str(switch_info['tableId'])
        flow_id = '0'

        response_from_odl = create_flow(switch_id, table_id, flow_id, src_mac_address, dest_mac_address, port_number)

    # todo here check if flows exist!!
    # call ping_between_hosts_and_get_avrg_time() with the flows
    time_with_flows = ping_between_hosts_and_get_avrg_time()
    gstats_list.append(float(time_with_flows))  # store in gstats_list[1] the avrg time before setting the flows

    return stats()


def create_flow(openflow_id, table_id, flow_id, src_mac_address, dest_mac_address, port_number):
    flow_dict = {'flow': [{
        'id': flow_id,
        'match': {'ethernet-match': {'ethernet-source': {'address': src_mac_address},
                                     'ethernet-destination': {'address': dest_mac_address},
                                     'ethernet-type': {'type': '0x800'}}},
        'instructions': {'instruction': [
            {'apply-actions': {'action': [{'output-action': {'output-node-connector': port_number}, 'order': '1'}]},
             'order': '1'}]},
        'installHw': 'false',
        'table_id': table_id}]}

    # e.g http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/openflow:1/table/2/flow/0
    h = httplib2.Http(".cache")
    h.add_credentials('admin', 'admin')

    url_to_send_to_odl = "http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/" + str(
        openflow_id) + "/table/" + str(table_id) + "/flow/" + str(flow_id)
    print url_to_send_to_odl
    gflows_list.append(url_to_send_to_odl)

    # monitor urls that we send to odl
    # with open('diagnostics/urls.txt',mode='a+') as urls_file:
    #     urls_file.write(url_to_send_to_odl)
    # urls_file.close()

    # monitor json that we send to odl
    # with open('diagnostics/requestsToODL.json',mode='a+') as json_file:
    #     json_file.write(json.dumps(flow_dict, json_file))
    # json_file.close()

    resp, content = h.request(
        uri=url_to_send_to_odl,
        method='PUT',
        headers={'Content-Type': 'application/json'},
        body=json.dumps(flow_dict)
    )

    # monitor json that we receive from odl
    # with open('diagnostics/responsesFromODL.json',mode='a+') as json_file2:
    #     json_file2.write(json.dumps(resp, json_file2))
    # json_file2.close()

    # send get in odl flows urls in 8181 to test thata the flows exists!
    if flow_exists():
        return jsonify({'success': True})
    return jsonify({'success': False})


def flow_exists():
    global gflows_list

    for url in gflows_list:
        response = requests.get(url, headers={'Accept': 'application/json',
                                              'Authorization': 'Basic YWRtaW46YWRtaW4='}).json()
        print response
        respons_str = str(response)
        # flag = response['errors']

        if 'errors' in respons_str:  # it menas that the flow doesnt exist
            return False

    return True  # the flow exists


# https://realpython.com/python-requests/
@app.route('/hello', methods=['GET'])
def hello():
    response = requests.get(
        'http://localhost:8181/restconf/operational/network-topology:network-topology',
        # params={'q': 'requests+language:python'},
        headers={'Accept': 'application/json', 'Authorization': 'Basic YWRtaW46YWRtaW4='},
    )
    return response.json()


@app.route('/pingall', methods=['POST'])
def pingall():
    global_net.pingAll()
    return jsonify({'success': True})


def ping_between_hosts_and_get_avrg_time():
    # global gshortest_path

    h_src_name = gshortest_path[0]
    h_dest_name = gshortest_path[-1]
    h_src_id, h_dest_id = "0x" + h_src_name[-2:], "0x" + h_dest_name[-2:]
    # print 'h_src_id = [{}] & h_dest_id = [{}]  .'. format(h_src_id, h_dest_id)

    h_src_suffix, h_dest_suffix = int(h_src_id, 16), int(h_dest_id, 16)  # convert hex string to hex number

    # print 'h_src_suffix = [{}] & h_dest_suffix = [{}]  .'. format(h_src_suffix, h_dest_suffix)

    h_src, h_dest = global_net.getNodeByName('h' + str(h_src_suffix)), global_net.getNodeByName(
        'h' + str(h_dest_suffix))  
    # print 'h_src = [{}] & h_dest = [{}]  '. format(h_src, h_dest)

    test_ping = h_src.cmd('ping -c10 %s' % h_dest.IP())
    print test_ping

    # first split
    avrgStats = test_ping.split("ping statistics", 1)[1]  # str from "ping statistics" and after
    # print avrgStats

    # second split
    split2 = avrgStats.split("/")  # take list after spliting the str with '/' token
    # print split2

    avrgTime = split2[4]  # take the avrg time value
    # print avrgTime
    # print 'avrgTime =[{}]'. format(avrgTime)

    return avrgTime




if __name__ == '__main__':
    # app.run(debug=True)
    http_server = WSGIServer(('', 5000), app)
    print "INFO: Server Started!"
    http_server.serve_forever()
