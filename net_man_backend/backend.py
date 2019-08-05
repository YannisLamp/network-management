#!flask/bin/python

from mininet.cli import CLI
from mininet.log import setLogLevel
from mininet.net import Mininet
from mininet.topo import Topo
from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch
from functools import partial

# from functools import partial
import os
import subprocess
from flask import Flask, jsonify

app = Flask(__name__)

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



tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]


@app.route('/')
def index():
    return "Hello, World!"

@app.route('/init_mn', methods=['GET'])
def init_mn():
    # cmd = ["ls",""]
    # p = subprocess.Popen(cmd, stdout = subprocess.PIPE,
    #                         stderr=subprocess.PIPE,
    #                         stdin=subprocess.PIPE)

    # p = subprocess.Popen('sudo python colab.py', shell=True, stdout = subprocess.PIPE,
    #                         stderr=subprocess.PIPE,
    #                         stdin=subprocess.PIPE)

    # out, err = p.communicate()
    # print out, err
    # return out
    #os.system('sudo python colab.py')
    #return "Network Created !!"
    runMinimalTopo()
    return 'alalaal'


@app.route('/stop_mn', methods=['GET'])
def stop_mn():
    # cmd = ["ls",""]
    # p = subprocess.Popen(cmd, stdout = subprocess.PIPE,
    #                         stderr=subprocess.PIPE,
    #                         stdin=subprocess.PIPE)

    # p = subprocess.Popen('sudo python colab.py', shell=True, stdout = subprocess.PIPE,
    #                         stderr=subprocess.PIPE,
    #                         stdin=subprocess.PIPE)

    # out, err = p.communicate()
    # print out, err
    # return out
    #os.system('sudo python colab.py')
    #return "Network Created !!"
    gnet.stop()
    return 'alalaal'

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(debug=True)






