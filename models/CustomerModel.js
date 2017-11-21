var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CustomerModel = new Schema({
    id: ObjectId,
    customerName: String,
    mobile: { type: Number },
    items: { type: Array }
});

var CustomerModel = mongoose.model('customer', CustomerModel);

module.exports = CustomerModel;