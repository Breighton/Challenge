const express = require('express')
const http = require('http');

const lp = require('./routes/longestPreview')
const about = require('./routes/about')

const app = express()

//app.listen(5000, function () {
//  console.log('Challenge response started, listening on port 5000!')
//})

app.get('/terms/:tid/longest-preview-media-url', lp.find)
app.get('/about', about.show)

// *** server config *** //
const server = http.createServer(app);
server.listen(8080, function() {
  console.log('Challenge server started, listening on port 8080!');
});

module.exports = app;
