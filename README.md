# Challenge
The app assumes you have node (Boron/LTS) installed (this challenge was developed and runs on v6.10.2).
For testing, it also assumes mocha is installed (v3.3.0 used for this development effort).
Note, node/Boron is installed as part of the Docker build, but if you wish to run and test manually (i.e. outside Docker),
they need to be available in the os or vm you clone this repo into…
  
After cloning into your local os or vm, move into the code folder and install all dependencies…
  
  $ cd challenge_app
  
  $ npm install # to insure all dependencies are met
  
you should be able to run the test suite (mocha/chai and with coverage stats from istanbul with:
    
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

Finally, the app looks to see if the environment variable LOG_REQUESTS is set to true, and if so
puts out highly detailed information about all incoming requests.  This is typically not needed, but
I found it very useful in tracking down bogus requests or denial of serverice type of requests, so
stuck it in there...  I would recommend running without it being defined or false <grin>.

