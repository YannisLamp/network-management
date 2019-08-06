#!flask/bin/python

from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from mininet.topo import Topo, 
from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch
from functools import partial

# from functools import partial
import os
import subprocess
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

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


def createNet(controllerIp, controllerPort, topologyType, 
        switchType, nodes, switches, mac, defaultTopo):
    "Bootstrap a Mininet network using the Minimal Topology"
 
    # Create an instance of our topology
    topo = MinimalTopo()
    
    switch = None
    if switches == 'OVSSwitch':
        switch = partial( OVSSwitch, protocols='OpenFlow13' )
    elif switches == 'OVSKernelSwitch':
        switch = partial( OVSSwitch, protocols='OpenFlow13' )

        
    # Create a network based on the topology using OVS and controlled by
    # a remote controller.
    net = Mininet(
        topo=topo,
        controller=lambda name: RemoteController( name, ip=controllerIp ),
        switch=switch,
        autoSetMacs=mac,
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


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/network', methods=['POST'])
def init_mn():
    # Get request data
    ip = request.json.get('ip')
    port = request.json.get('port')
    topologyType = request.json.get('topologyType')
    switchType = request.json.get('switchType')
    nodes = request.json.get('nodes')
    switches = request.json.get('switches')
    mac = request.json.get('mac')
    defaultTopo = request.json.get('defaultTopo')
    
    # Create network
    #runMinimalTopo()
    createNet(ip, port, topologyType, switchType, nodes, 
            switches, mac, defaultTopo)

    return jsonify({'msg': 'Network Created'})


@app.route('/network', methods=['DELETE'])
def stop_mn():
    gnet.stop()
    return jsonify({'msg': 'Network Stopped'})


if __name__ == '__main__':
    app.run(debug=True)






