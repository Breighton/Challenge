# Challenge

The app assumes you have node (Boron/LTS) installed (this challenge was developed and runs on v6.10.2)
For testing, it also assumes mocha is installed (v3.3.0 used for this development effort)

After cloning into your local os or vm, then moving into the code folder and making sure
all dependencies are present...

  $ cd challenge_app
  
  $ npm install # to insure all dependencies are met
  
you should be able to run the test suite (moch/chai and with coverage stats from istanbul with:
  
  $ npm test

and if you wish to run the app manually (outside of Docker), use:

  $ npm start

with the app running, you should be able to access the available endpoints via a browser with:
(Note: the app is listening on port 5000)

http://localhost:5000/about                                     # (to know what the app is and which version is running)

http://localhost:5000/terms/26681/longest-preview-media-url     # to answer the challenge question

A Dockerfile (and .dockerignore) are included in order to build and run a docker container using
  standard docker commands (assumes you are in the folder challenge_app where the Dockerfile lives)...

$ docker build -t breighton/node-challenge-app .

$ docker run -p 5000:5000 -d breighton/node-challenge-app

These commands are included in a script docker-build-and-run.sh for your convenience...

With the docker app running, you can access the endpoints the same as stated above
(with the above command, the docker app is also listening on port 5000)

With the app running (either manually or in docker), you can perform sandbox tests on the endpoint
by running the script test/sandboxTests.sh to insure all is working and seeing some useful stats.
