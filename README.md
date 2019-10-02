# Software Defined Networking

Implementation of 2 apps using Mininet as a  Virtual Network Simulator and OpenDaylight platform for creating a Software-Defined-Networking Controller.

# The team
## App1
Ioannis Papadopoulos
Giannis Lamprou
## App2
Dimitris Gaggas
Nemanja Nedic

# Application Documentation
## App1: Node.js application for extracting statistics from OpenDaylight about the network

## App2: Djikstra Shortest Path algorithm implementation on the network in order to find the shortest path between two switches

This app will find the shortest path between two switches, then install some flows to create a path between them.
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
