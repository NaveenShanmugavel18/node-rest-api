var restify = require('restify');
var server = restify.createServer();
var setupController = require('./controllers/setupController.js');
var restaurantController = require('./controllers/restaurantController.js');
var customerController = require('./controllers/customerController.js');
var restifyValidator = require('restify-validator');
var config = require('./config/dbConnection.js');
var mongoose = require('mongoose');

mongoose.connect(config.getMongoConnection() , { useMongoClient: true });
setupController(server, restify, restifyValidator);
restaurantController(server);
customerController(server);

server.listen(5000, function() {
  console.log('%s listening at %s', server.name, server.url);
});