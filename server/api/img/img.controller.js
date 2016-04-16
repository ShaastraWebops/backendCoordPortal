'use strict';

var _ = require('lodash');
var Img = require('./img.model');
var express = require('express'); 
var app = express(); 
var cors = require('cors');
var fs = require('fs');

app.use(cors());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Get list of imgs
exports.index = function(req, res) {
  Img.find(function (err, imgs) {
    if(err) { return handleError(res, err); }
    return res.json(200, imgs);
  });
};

exports.download = function (req, res) {
  var file = req.params.fileName;
  var departmentName = req.params.departmentName;
  var path = 'server/api/img/uploads/' + departmentName + '/' + file;
  console.log(path);
  res.download(path);
}

exports.getFiles = function (req, res) {
  var departmentName = req.params.departmentName;
  console.log(departmentName);
  console.log('server/api/img/uploads/' + departmentName + '/');
  fs.readdir('server/api/img/uploads/' + departmentName + '/', function(err, items) {
    console.log(items);
    res.json(items);
  });
}

// Get a single img
exports.show = function(req, res) {
  Img.findById(req.params.id, function (err, img) {
    if(err) { return handleError(res, err); }
    if(!img) { return res.send(404); }
    return res.json(img);
  });
};

// Creates a new img in the DB.
exports.create = function(req, res) {
  console.log(req.file);
  return res.json(201, {message: "Boom!"});
  /*Img.create(req.body, function(err, img) {
    if(err) { return handleError(res, err); }
    return res.json(201, img);
  });*/
};

// Updates an existing img in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Img.findById(req.params.id, function (err, img) {
    if (err) { return handleError(res, err); }
    if(!img) { return res.send(404); }
    var updated = _.merge(img, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, img);
    });
  });
};

// Deletes a img from the DB.
exports.destroy = function(req, res) {
  Img.findById(req.params.id, function (err, img) {
    if(err) { return handleError(res, err); }
    if(!img) { return res.send(404); }
    img.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
