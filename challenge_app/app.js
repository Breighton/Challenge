const express = require('express');
const http = require('http');
const bunyan = require('bunyan');
const bunyanRequest = require('bunyan-request');

const lp = require('./routes/longestPreview');
const about = require('./routes/about');

const app = express();

const port = 5000;

// Logging
const logger = bunyan.createLogger({name: "Challenge"});
// Only log detailed requests if LOG_REQUESTS is true
if (process.env.LOG_REQUESTS === 'true') {
  const requestLogger = bunyanRequest({
      logger: logger,
      headerName: 'x-request-id'
  });
  app.use(requestLogger);
}

//app.listen(5000, function () {
//  console.log('Challenge response started, listening on port 5000!')
//})

app.get('/terms/:tid/longest-preview-media-url', lp.find);
app.get('/about', about.show);

// *** server config *** //
const server = http.createServer(app);
server.listen(port, function() {
  logger.info({process: 'Challenge Server',
      version: about.version,
      port: app.get(port),
      message: 'Server started'});
});

module.exports = app;
