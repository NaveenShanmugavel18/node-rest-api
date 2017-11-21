var helpers = require('../config/helperFunctions.js');
var RestaurantModel = require('../models/RestaurantModel.js');

module.exports = function(server) {
	
	// Get all restaurant list
	server.get("/restaurant", function(req, res, next) {
		RestaurantModel.find({}, function (err, restaurant) {
			helpers.success(res, next, restaurant);
			return next();
		});
	});

	// Get restaurant based on Id
	server.get("/restaurant/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		RestaurantModel.findOne({ _id: req.params.id }, function (err, restaurant) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the restaurant from the database', 500);
				return next();
			}
			if (restaurant === null) {
				helpers.failure(res, next, 'The specified restaurant could not be found', 404);
				return next();
			}
			helpers.success(res, next, restaurant);
			return next();
		});
	});

	// Create new restaurant
	server.post("/restaurant/create", function(req, res, next) {
		req.params = req.body;
		req.assert('restaurantName', 'Restaurant Name is required').notEmpty();
		req.assert('location', 'Location is required').notEmpty();
		req.assert('items', 'Items associated with restaurant must be specified').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors, 400);
			return next();
		}
		var restaurant = new RestaurantModel();
		restaurant.restaurantName = req.body.restaurantName;
		restaurant.location = req.body.location;
		restaurant.items = req.body.items;
		restaurant.save(function (err) {
			if (err) {
				helpers.failure(res, next, errors, 500);
				return next();
			}
			helpers.success(res, next, restaurant);
			return next();
		});
	});

	// Edit items
	server.put("/restaurant/:id", function(req, res, next) {
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		RestaurantModel.findOne({ _id: req.params.id }, function (err, restaurant) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the restaurant from the database', 500);
				return next();
			}
			if (restaurant === null) {
				helpers.failure(res, next, 'The specified restaurant could not be found', 404);
				return next();
			}
			var updates = req.body;
			for (var field in updates) {
				restaurant[field] = updates[field];
			}
			restaurant.save(function (err) {
				if (err) {
					helpers.failure(res, next, errors, 500);
					return next();
				}
				helpers.success(res, next, restaurant);
				return next();
			});
		});
	});

	// Restaurant delete
	server.del("/restaurant/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		RestaurantModel.findOne({ _id: req.params.id }, function (err, restaurant) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the restaurant from the database', 500);
				return next();
			}
			if (restaurant === null) {
				helpers.failure(res, next, 'The specified restaurant could not be found', 404);
				return next();
			}
			restaurant.remove(function (err) {
				if (err) {
					helpers.failure(res, next, errors, 500);
					return next();
				}
				var message = `Restaurant ${req.params.id} deleted successfully!`
				helpers.success(res, next, message);
				return next();
			});
		});
	});
}