var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var picSchema = new Schema({
	dateAdded: {type: Date, default: Date.now},
	title: String,
	description: String,
	fullSize_url: String,
	thumb_url: String,
	approved: {type:Boolean, default: true}
})

module.exports = mongoose.model('Picture', picSchema);