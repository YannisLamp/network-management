# Software Defined Networking

Implementation of 2 apps using Mininet as a  Virtual Network Simulator and OpenDaylight Software-Defined-Networking Controller.

##### Table of Contents

[The team](#team)  

[How to run](#run)

[How to use](#use)

[How it works](#works)

....[Network Creation](#create)

....[Network Overview](#overview)

....[Flow Creation](#flow)

....[Delete Network](#delete)   

!!!!
## Network Creation

A graphical Mininet network creation interface, providing many different network options through a menu, making the creation and deletion of networks effortless, so that our Apps can be used on a wide range of parameters? .

## App1:
React Frontend, provides an ineractive/clickable visualization of the network, serves statistics about out Mininet Network, but also communicates with the second Python (App2) which is capable of manipulating the Mininet Network directly. Deployed using Node.js.

!!!!
An interactive, fully clickable visualisation of the created Mininet network, which serves extensive information for each host, switch or link, and overall network statistics provided by the Opendaylight API. 
For this App, our line of thought was that the existing network visualisation interface provided by Opendaylight was somewhat difficult to navigate, spanning multiple pages and ultimately not communicating the whole range of information available, so we thought we would expand on it, making it more 

## App2:
Backend for Network manipulation, with the extended capability of Flow Cration using Dijkstra Shortest Path algorithm implementation on the network in order to find the shortest path between two switches.

After finding the shortest path between two switches, then install some flows to create a path between them.

It uses Flask micro web framework to provide a web interface for the functions of our app and the ```mininet``` python lib to operate on the network.

!!!
A Flow creation tool, which after promting the user to pick two hosts from a graphical representation of the created Mininet network, calculates the shortest path between the chosen nodes using the Dijkstra algorithm, then imposing a flow, based on that path. Our reasoning for choosing to implement this application is that as making packet transfers as fast and effective as possible is a fundamental networking element, it would be interesting to measure and compare transfer times with and without the use of flows. (and determine how much of an improvement the addition of flows is??) 


<a name="team"/>

# The team

[John Papadopoulos](https://github.com/jackalakos) sdi1400144

[Yannis Lamprou](https://github.com/YannisLamp) sdi1400088

[Dimitris Gangas](https://github.com/dimitrisgan) sdi1400024

[Nemanja Nedic](https://www.linkedin.com/in/nemanja-nedic/) sdi1400124


# The Stack

![stack image](https://github.com/YannisLamp/network-management/blob/master/SDN.png "The Stack")

<a name="run"/>

# How to run

In this sequence:

```export TERM=exterm-color```

```./distribution-karaf-0.5.4-Boron-SR4/bin/karaf –of13```

```sudo python2 backend.py```

```cd net-man-app && sudo npm start```

Login to OpenDaylight:

```localhost:8181/index.html```

```user: admin```

```pass: admin```

<a name="use"/>

# How to use

Navigate to: ```http://localhost:3000```

You will be prompted with the network creation page. Select the netwok properties or just press default values.

Note: Djikstra is pointless for a Linear Network, so if you want to inspect that functionality don't choose Linear.

Note: If tree topology is selected, it might take some time to create the network since the network size increases exponentially based on the input parameters. We suggest that for demo purposes you select a smaller network tree.

NOTE: if you close mininet abruptly (ie. Ctrl+C) use this to reset it:```sudo mn -c```




<a name="works"/>

# How it works

<a name="create"/>

## Network Creation

This demo show how to create a network on the app:
![alt text](https://github.com/YannisLamp/network-management/blob/master/create_network.gif "Create Network")

App1: starting it checks weather a network already exists or not by asking App2 about the status. If not you will be prompted to create one. After submitting the form a POST request is sent to the backend /network.

App2: Listens for a POST request on /network, with the parameters for the network.

The network is created with this command ``` Mininet(topo=topology, controller=controller, switch=switch, autoSetMacs=mac, waitConnected=True)``` based on the parameters passed.

As soon as the network is created it is started and a ```net.pingAll()``` is called along with ```mininet.util.dumpNodeConnections(net.hosts)``` so that we establish all new connections. In case there are leftover flows from a previous session these will be deleted before creating a new network.

<a name="overview"/>

## Network Overview

This is a demo of the Network Overview app and the stastistics it provides:
![alt text](https://github.com/YannisLamp/network-management/blob/master/network_overview.gif "Network Overview")

Clarification:

Rx: # received

Tx: # transmitted

Using simple React states and click handlers displays information and statistics about the current status of the network.

<a name="flow"/>

## Flow Creation

![alt text](https://github.com/YannisLamp/network-management/blob/master/create_flow.gif "Shortest Path Between nodes")

Frontend send a POST request to ```/shortest_path```.

Backend answers to that request with a list of node-ids that represent the shortest path.

The Frontend displays the shortest path with a blue line on the topo-graph and then sends a POST request to ```/flows``` in order to create the necessary flows.

The backend then calls ```/restconf/config/opendaylight-inventory:nodes/node/{{openflow_id}}/table/{{table_id}}/flow/{{flow_id}}```

with:

```
{'flow': [{
        'id': flow_id,
        'match': {'ethernet-match': {'ethernet-source': {'address': src_mac_address},
                                     'ethernet-destination': {'address': dest_mac_address},
                                     'ethernet-type': {'type': '0x800'}}},
        'instructions': {'instruction': [
            {'apply-actions': {'action': [{'output-action': {'output-node-connector': port_number}, 'order': '1'}]},
             'order': '1'}]},
        'installHw': 'false',
        'table_id': table_id}]}
```

In order to create the new flow.

<a name="delete"/>

## Delete Network
![alt text](https://github.com/YannisLamp/network-management/blob/master/delete_network.gif "Network delete")

Front sends DELETE request to ```/network```.

Backend deletes all flows that we created (kept in global ```gflows_list```).

Network is stopped ```global_net.stop()``` and ```{'msg': 'Network Stopped'}``` returned.
 

