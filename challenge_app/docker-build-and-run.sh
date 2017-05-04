#!/bin/bash
docker build -t breighton/node-challenge-app .
docker run -p 5000:5000 -d breighton/node-challenge-app
