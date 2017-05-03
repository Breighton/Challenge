var express = require('express')
var lp= require('./routes/longestPreview')
var about = require('./routes/about')

var app = express()

app.listen(5000, function () {
  console.log('Challenge respone started, listening on port 5000!')
})

app.get('/terms/:tid/longest-preview-media-url', lp.find)

app.get('/about', about.show)

