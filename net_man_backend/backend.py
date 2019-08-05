#!flask/bin/python

# from mininet.cli import CLI
# from mininet.log import setLogLevel
# from mininet.net import Mininet
# from mininet.topo import Topo
# from mininet.node import RemoteController, OVSSwitch, OVSKernelSwitch

# from functools import partial
import os
import subprocess
from flask import Flask, jsonify

app = Flask(__name__)


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
    os.system('sudo python colab.py')
    return "Network Created !!"

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(debug=True)