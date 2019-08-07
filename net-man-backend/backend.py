#!flask/bin/python

from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from mininet.topo import Topo, LinearTopo, SingleSwitchTopo
from mininet.topolib import TreeTopo
from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch
from mininet.clean import Cleanup
from functools import partial

# from functools import partial
import os
import subprocess
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

gnet = None

class MinimalTopo( Topo ):
    "Minimal topology with a single switch and two hosts"
 
    def build( self ):
        # Create two hosts.
        h1 = self.addHost( 'h1' )
        h2 = self.addHost( 'h2' )

        h3 = self.addHost( 'h3' )
        h4 = self.addHost( 'h4' )
 
        # Create a switch
        s1 = self.addSwitch( 's1' )
        s2 = self.addSwitch( 's2' )
        s3 = self.addSwitch( 's3' )

 
        # Add links between the switch and each host
        self.addLink( s1, h1 )
        self.addLink( s1, h2 )

        self.addLink( s2, h3 )
        self.addLink( s2, h4 )

        # Switch to link swicthes
        self.addLink( s3, s1 )
        self.addLink( s3, s2 )


def runMinimalTopo():
    "Bootstrap a Mininet network using the Minimal Topology"
 
    # Create an instance of our topology
    topo = MinimalTopo()
    
    switch = partial( OVSSwitch, protocols='OpenFlow13' )

    # Create a network based on the topology using OVS and controlled by
    # a remote controller.
    net = Mininet(
        topo=topo,
        controller=lambda name: RemoteController( name, ip='127.0.0.1' ),
        switch=switch,
        autoSetMacs=True,
    )
 
    # Actually start the network
    net.start()
 
    # Drop the user in to a CLI so user can run commands.
    #CLI( net )
 
    # After the user exits the CLI, shutdown the network.
    #net.stop()
 

    # We need this to be global
    global gnet
    gnet = net

    print 'created mini'


def createNet(controllerIp, controllerPort, topoType, 
        switchType, nodesPerSwitch, switches, mac):
    "Bootstrap a Mininet network using the Minimal Topology"

    # Create an instance of our topology
    #topo = MinimalTopo()

    topo = None
    if topoType == 'linear':
        topo = LinearTopo(k=switches, n=nodesPerSwitch)
    elif topoType == 'tree':
        topo = TreeTopo(depth=switches, fanout=nodesPerSwitch)
    elif topoType == 'single':
        topo = SingleSwitchTopo(k=nodesPerSwitch)

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
    )
 
    # Actually start the network
    net.start()
    net.pingAll()
    # Drop the user in to a CLI so user can run commands.
    #CLI( net )
    
    # Export local net
    global gnet
    gnet = net


@app.route('/')
def index():
    return "Hello, World!"


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
        mac == False

    topoType = request.json.get('topoType')
    switchType = request.json.get('switchType')
    switches = int( request.json.get('switches') )
    nodesPerSwitch = int( request.json.get('nodesPerSwitch') )
    
    defaultTopo = request.json.get('defaultTopo')
    
    # Create network
    #runMinimalTopo()

    createNet(ip, port, topoType, switchType, nodesPerSwitch, 
            switches, mac)

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

if __name__ == '__main__':
    app.run(debug=True)






