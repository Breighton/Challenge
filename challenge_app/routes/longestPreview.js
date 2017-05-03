var express = require('express')
var app = express()

exports.find = function (req, res) {
  console.log("Processing request: " + req.params.tid)
  res.json({'message' : 'Hello World:', 'params' : req.params.tid})
}

