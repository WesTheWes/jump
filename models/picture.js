var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var picSchema = new Schema({
	dateAdded: {type: Date, default: Date.now},
	title: String,
	description: String,
	url: String,
	approved: {type:Boolean, default: true}
})

module.exports = mongoose.model('Picture', picSchema);