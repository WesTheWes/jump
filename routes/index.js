var debug 		= require('debug')('routers'),
	fs 			= require('fs'),
	util 		= require('util'),
	path 		= require('path'),
	multiparty 	= require('multiparty'),
	Picture 	= require('../models/picture');

// Create an express router

var express 	= require('express'),
	router 		= express.Router();						

// Log that router is starting

router.use(function(req,res,next){
	debug('Routing request.');
	next();
})

// Temporarily upload picture to server

router.post('/upload', function(req,res,next) {
	var form = new multiparty.Form({uploadDir:'./public/images'});
	form.parse(req, function(err, fields, files){
		if(err){ next(err) }
		var title = fields.title,
			description = fields.description,
			url = path.basename(files.picture[0].path);
		var picture = new Picture({
			title: title,
			description: description,
			url: url
		});
		picture.save();
		console.log('Picture Saved');
		res.redirect('..');
		});
	;
});


// Router for GET request of homepage

router.get('/', function(req,res,next){				
	debug("GET '/'");
	Picture.find(function(err, pictures){
		res.render('home', {title : 'Jumping is Fun!', pictures : pictures});	// Render homepage
	})	
})

exports.router = router;