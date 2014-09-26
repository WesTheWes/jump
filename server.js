var debug = require('debug')('server');										// Use debug for development
var app = require('./app');

app.set('port', process.env.PORT || 3000);									// Set the port to PORT environment variable, or 3000 if not specified

var server = app.listen(app.get('port'), function(){						// Start server on set port
	debug('Server listening on port ' + server.address().port + '.');		// Messege for debug
})