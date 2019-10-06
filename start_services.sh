#!/bin/bash

./distribution-karaf-0.5.4-Boron-SR4/bin/karaf –of13
karaf_pid=$!
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start karaf: $status"
  exit $status
else
  echo "karaf_pid: $karaf_pid"
fi

npm start npm start --prefix ./net-man-app
front_pid=$!
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start frontend: $status"
  exit $status
else
  echo "front_pid: $front_pid"
fi

python2 ./net-man-backend/src/backend.py
back_pid=$!
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start backend: $status"
  exit $status
else
  echo "back_pid: $back_pid"
fi