# Software Defined Networking

Implementation of 2 apps using Mininet as a  Virtual Network Simulator and OpenDaylight Software-Defined-Networking Controller.
App1 is a React frontend that serves statistics about out Mininet Network, but also communicates with the second Python (App2) which is capable of manipulating the Mininet Network directly.

# The team

![John Papadopoulos](https://github.com/jackalakos "John Papadopoulos")

![Giannis Lamprou](https://github.com/jackalakos "Giannis Lamprou")

![Dimitris Gangas](https://github.com/dimitrisgan "Dimitris Gangas")

[Nemanja Nedic](https://www.linkedin.com/in/nemanja-nedic/)


# The Stack

![stack image](https://github.com/YannisLamp/network-management/blob/master/SDN.png "The Stack")

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

# How to use

Navigate to: ```http://localhost:3000```

You will be prompted with the network creation page. Select the netwok properties or just press default values.

Note: Djikstra is pointless for a Linear Network, so if you want to inspect that functionality don't choose Linear.

Note: If tree topology is selected, it might take some time to create the network since the network size increases exponentially based on the input parameters. We suggest that for demo purposes you select a smaller network tree.

NOTE: if you close mininet abruptly (ie. Ctrl+C) use this to reset it:```sudo mn -c```





# How it works

## Network Creation

This demo show how to create a network on the app:
![alt text](https://github.com/YannisLamp/network-management/blob/master/create_network.gif "Create Network")

App1: starting it check weather a network already exists or not by asking App2 about the status. If not you will be prompted to create one. 

App2: Listens for a POST request about network creation, with the parameters for the network. As soon as the network is created it is started and a pingAll prodecure is called so that we establish all connections. In case there are leftover flows from a previous session these will be deleted before creating a new network.



## Network Overview

This is a demo of the Network Overview app and the stastistics it provides:
![alt text](https://github.com/YannisLamp/network-management/blob/master/network_overview.gif "Network Overview")

Clarification:

Rx: # received

Tx: # transmitted

App1: sends a GET request to App2/flows. App2 answers with statistics. 

## Flow Creation

![alt text](https://github.com/YannisLamp/network-management/blob/master/create_flow.gif "Shortest Path Between nodes")

Uses Djikstra Shortest Path algorithm implementation on the network in order to find the shortest path between two switches.
After finding the shortest path between two switches, then install some flows to create a path between them.
It uses Flask micro web framework to provide a web interface for the functions of our app.

POST /shortest_path
POST /flows

## Delete Network
![alt text](https://github.com/YannisLamp/network-management/blob/master/delete_network.gif "Network delete")




# AUTA EDW KATW THA SVISTOUN. EAN THELETE NA KRATISETE KATI VALTE TO KAPOU APO PANW---------------------

OpenAPI API's:
```http://localhost:8181/restconf/operational/opendaylight-inventory:nodes```
```http://localhost:8181/restconf/operational/opendaylight-inventory:nodes/node/' + nodeId + '/table/' + tableId```

```http://localhost:8181/restconf/operational/network-topology:network-topology```

```http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/' + nodeId```
```http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/'```
 ```nodeId + '/flow-node-inventory:table/'+tableId + '/flow/'+flowId```

Namely:
### localhost:5000/network
 #### GET
 #### POST
 #### DDELETE

### localhost:5000/shortest_path
 #### GET
 #### POST
 #### DELETE

### localhost:5000/flows
 #### GET
 #### POST
 #### DELETE

### localhost:5000/hello
 #### GET
 
### localhost:5000/pingall
 #### POST
 

