var debug 		= require('debug')('routers'),
	fs 			= require('fs'),
	util 		= require('util'),
	path 		= require('path'),
	multiparty 	= require('multiparty'),
	gm 			= require('gm'),
	mime		= require('mime'),
	Picture 	= require('../models/picture'),
	uploadDir	= './public/images/jumpingPics';


// Create an express router

var express 	= require('express'),
	router 		= express.Router();						

// Log that router is starting

router.use(function(req,res,next){
	debug('Routing request.');
	next();
})

// Create s3 client

var	AWS			= require('aws-sdk'),
	s3 = new AWS.S3({	
		accessKeyId: process.env.s3_access_key_ID,
		secretAccessKey: process.env.s3_secret_access_key
	}),
	s3_base_url = 'https://s3-us-west-1.amazonaws.com/' + process.env.s3_bucket + '/';

// Upload picture to AWS S3

router.post('/upload', function(req,res,next) {
	var form = new multiparty.Form({uploadDir:uploadDir});
	fs.mkdir(uploadDir, function(err){
		if(err) { 
			if(err.code != 'EEXIST'){ next(err) }
		}
	})
	form.parse(req, function(err, fields, files){
		if(err){ next(err) }

		// Helper function for altering filename of picture

		function extendFilename(file, addition) {
			return file.replace(path.extname(file), addition + path.extname(file));
		}

		function getImageUrl(file, cb) {
			data = {
				Bucket : process.env.s3_bucket,
				Key : file
			};
			result = s3.getSignedUrl('getObject', data);
			cb(result);
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

		var picture = files.picture[0].path,
			fullSize = path.basename(picture),
			thumb = extendFilename(fullSize, '_thumb'),
			mimeType = mime.lookup(picture);

		// Resize and crop picture from crop and rotate data
		gm(picture)
		.rotate('black', rotation)
		.crop(width, height, x, y)
		.stream(function(err, stdout, stderr) {
			if(err) next(err);

			var buf = new Buffer('');
			stdout.on('data', function(data){
				buf = Buffer.concat([buf, data]);
			});

			stdout.on('end', function(data){
				data = {
					Bucket : process.env.s3_bucket,
					Key : fullSize,
					Body : buf,
					ContentType : mimeType,
					ACL: 'public-read'
				};

				s3.putObject(data, function(err,res){
					if(err) next (err)
					console.log('file "' + fullSize +'" uploaded');
				});
			});
			// Resize picture for thumb
			gm(stdout)
			.resize(500)
			.stream(function(err, stdout, stderr) {
				if(err) next(err);

				var buf = new Buffer('');
				stdout.on('data', function(data){
					buf = Buffer.concat([buf, data]);
				}); 
				stdout.on('end', function(data){
					data = {
						Bucket : process.env.s3_bucket,
						Key : thumb,
						Body : buf,
						ContentType : mimeType,
						ACL: 'public-read'
					};

					s3.putObject(data, function(err,res){
						if(err) next(err);
						console.log('file "' + thumb +'" uploaded');

						//Save picture to database
						var picture = new Picture({
							title: title,
							description: description,
							fullSize_url: s3_base_url + fullSize,
							thumb_url: s3_base_url + thumb
						});
						picture.save();
						console.log('Picture Saved');	
					});
				});
			})
			res.redirect('..');
		});
	});
});

// Router for GET request of homepage

router.get('/', function(req,res,next){			
	debug("GET '/'");
	Picture.find().sort('-dateAdded').exec(function(err, pictures){
		res.render('home', {title : 'Jumping is Fun!', pictures : pictures});	// Render homepage
	});	
});

exports.router = router;