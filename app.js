/** Express app that exports app to server */


var express = require('express');					// Requirements
var logger = require('morgan');
var favicon = require('serve-favicon');
var path = require('path');

// Connect to MongoLab

var mongoose = require('mongoose');
var mongoDB = process.env.mongodb || require('./database/mongoLab');
mongoose.connect(mongoDB);


var router = require('./routes').router;            // Import routes module, which contains all routes

var app = express();								// Create app


app.set('views', path.join(__dirname,'views'));		// Set location of views to ./views

app.set('view engine', 'jade');						// Set view engine to jade

app.use(logger('dev'))								// Use logger with dev settings

app.use(express.static(								// Use './public' for static files
	path.join(__dirname, 'public')
	));

app.use(router);									// Configure app to use imported routes

app.use(function(req, res, next) {					// Call 404 error if nothing is found
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/***************** Error Handlers *****************/

if (app.get('env') === 'development') {				// Development error handler
    app.use(function(err, req, res, next) {			// Gives full error stacktrace
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next) {				// Production error handler
    res.render('error', {							// No stacktraces leaked to user
        message: err.message,
        error: {}
    });
});

module.exports = app;								// Export this bad boy to the server file!