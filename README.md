# Software Defined Networking

Implementation of 2 apps using Mininet as a  Virtual Network Simulator and OpenDaylight platform for creating a Software-Defined-Networking Controller.

# The team
## App1: Network Overview
Ioannis Papadopoulos

Giannis Lamprou

## App2: Flow Creator
Dimitris Gangas

Nemanja Nedic

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

You will be prompted with the network creation page. Select the netowrk properties or just press default values.

Note: Djikstra is pointless for a Linear Network, so if you want to inspect that functionality don't choose Linear.
Note: If tree topology is selected, it might take some time to create the network since the network size increases exponentially based on the input parameters. We suggest that for demo purposes you select a smaller network tree.
NOTE: if you close mininet abruptly (ie. Ctrl+C) use this to reset it:```sudo mn -c```

This demo show how to create a network on the app:
![alt text](https://github.com/YannisLamp/network-management/blob/master/create_network.gif "Create Network")



# Application Documentation
## App1: Network Overview
This is a demo of the Network Overview app and the stastistics it provides:
![alt text](https://github.com/YannisLamp/network-management/blob/master/network_overview.gif "Network Overview")


Node.js application for extracting statistics from OpenDaylight about the network.
It runs on  ```localhost:3000``` 

OpenAPI API's:
```http://localhost:8181/restconf/operational/opendaylight-inventory:nodes```
```http://localhost:8181/restconf/operational/opendaylight-inventory:nodes/node/' + nodeId + '/table/' + tableId```
```http://localhost:8181/restconf/operational/network-topology:network-topology```
```http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/' + nodeId```
```http://localhost:8181/restconf/config/opendaylight-inventory:nodes/node/'```
 ```nodeId + '/flow-node-inventory:table/'+tableId + '/flow/'+flowId```


## App2: Flow Creator
![alt text](https://github.com/YannisLamp/network-management/blob/master/create_flow.gif "Shortest Path Between nodes")

Uses Djikstra Shortest Path algorithm implementation on the network in order to find the shortest path between two switches.
After finding the shortest path between two switches, then install some flows to create a path between them.
It uses Flask micro web framework to provide a web interface for the functions of our app.


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
 
# Delete Network
![alt text](https://github.com/YannisLamp/network-management/blob/master/delete_network.gif "Network delete")
