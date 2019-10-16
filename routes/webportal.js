'use strict';

var users = require('../controllers/users')
var cors = require('cors');

module.exports = function(app) {
	// --
	// Product

	app.use(cors());
	
	app.get('/', function(req, res){
		return res.send('NodeJS API working');
	});
	
	app.post('/api/v1/appointment/create', users.addAppointment);
	app.get('/api/v1/appointment', users.getAppointment);
	app.post('/api/v1/user/signin', users.signin);
	app.post('/api/v1/user/signup', users.signup);
	app.get('/api/v1/user/logout', users.logout);

}