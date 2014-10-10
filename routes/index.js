var debug 		= require('debug')('routers'),
	fs 			= require('fs'),
	util 		= require('util'),
	path 		= require('path'),
	multiparty 	= require('multiparty'),
	gm 			= require('gm'),
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

		// Helper function for altering filename of picture

		function extendFilename(file, addition) {
			return file.replace(path.extname(file), addition + path.extname(file));
		}

		// Get all form data
		var title 		= fields.title,
			description = fields.description,
			x			= fields.xData,
			y			= fields.yData,
			width		= fields.widthData,
			height		= fields.heightData,
			rotation	= fields.rotation;
		console.log(title + description + x + y + width + height + rotation);

		var picture = files.picture[0].path;
			fullSize_url = path.basename(picture)
			thumb_url = extendFilename(fullSize_url, '_thumb');
		
		// Resize and crop picture from crop and rotate data
		gm(picture).rotate('black', rotation).crop(width, height, x, y).write(picture, function(err) {
			if(err) next(err);
			// Resize picture for thumb
			gm(picture).resize(300).write(extendFilename(picture, '_thumb'), function(err) {
				if(err) next(err); 

				// Save picture to database
				var picture = new Picture({
					title: title,
					description: description,
					fullSize_url: fullSize_url,
					thumb_url: thumb_url
				});
				picture.save();
				console.log('Picture Saved');
				res.redirect('..');
			});
		});
	});
});

// Router for GET request of homepage

router.get('/', function(req,res,next){				
	debug("GET '/'");
	Picture.find().sort('-dateAdded').exec(function(err, pictures){
		res.render('home', {title : 'Jumping is Fun!', pictures : pictures});	// Render homepage
	})	
})

exports.router = router;