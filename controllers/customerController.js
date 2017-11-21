var helpers = require('../config/helperFunctions.js');
var CustomerModel = require('../models/CustomerModel.js');

module.exports = function(server) {

	// Get customer order details based on Id
	server.get("/customer/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		CustomerModel.findOne({ _id: req.params.id }, function (err, customer) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the customer from the database', 500);
				return next();
			}
			if (customer === null) {
				helpers.failure(res, next, 'The specified order id could not be found', 404);
				return next();
			}
			helpers.success(res, next, customer);
			return next();
		});
	});

	// Create new order
	server.post("/customer/order", function(req, res, next) {
		req.params = req.body;
		req.assert('customerName', 'Customer Name is required').notEmpty();
		req.assert('mobile', 'Mobile is required').notEmpty();
		req.assert('items', 'Items must be specified').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors, 400);
			return next();
		}
		var customer = new CustomerModel();
		customer.customerName = req.body.customerName;
		customer.mobile = req.body.mobile;
		customer.items = req.body.items;
		customer.save(function (err) {
			if (err) {
				helpers.failure(res, next, errors, 500);
				return next();
			}
			helpers.success(res, next, customer);
			return next();
		});
	});

	// Edit orders
	server.put("/customer/:id", function(req, res, next) {
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		CustomerModel.findOne({ _id: req.params.id }, function (err, customer) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the customer from the database', 500);
				return next();
			}
			if (customer === null) {
				helpers.failure(res, next, 'The specified customer could not be found', 404);
				return next();
			}
			var updates = req.body;
			for (var field in updates) {
				customer[field] = updates[field];
			}
			customer.save(function (err) {
				if (err) {
					helpers.failure(res, next, errors, 500);
					return next();
				}
				helpers.success(res, next, customer);
				return next();
			});
		});
	});

	// Delete orders
	server.del("/customer/:id", function(req, res, next) {
		req.assert('id', 'Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res, next, errors[0], 400);
			return next();
		}
		CustomerModel.findOne({ _id: req.params.id }, function (err, customer) {
			if (err) {
				helpers.failure(res, next, 'Something went wrong while fetching the customer from the database', 500);
				return next();
			}
			if (customer === null) {
				helpers.failure(res, next, 'The specified customer could not be found', 404);
				return next();
			}
			customer.remove(function (err) {
				if (err) {
					helpers.failure(res, next, errors, 500);
					return next();
				}
				var message = `Order ${req.params.id} deleted successfully!`
				helpers.success(res, next, message);
				return next();
			});
		});
	});
}