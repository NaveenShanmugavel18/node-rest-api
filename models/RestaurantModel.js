var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var RestaurantSchema = new Schema({
    id: ObjectId,
    restaurantName: String,
    location: String,
    items: { type: Array}
});

var RestaurantModel = mongoose.model('restaurant', RestaurantSchema);

module.exports = RestaurantModel;