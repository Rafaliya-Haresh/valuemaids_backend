var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	passport = require('passport'),
	router = require('./routes/webportal'),
	bodyParser = require('body-parser');

// --
// Connect mongoose
mongoose.connect('mongodb://ec2-3-231-64-29.compute-1.amazonaws.com:27017/valuemaids'); 

// Set express configs
process.env.PORT = process.env.PORT || 5000;
app.set('port', process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));

app.use(require('express-session')({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
 }));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')();

// --
// Define routes/controller
app.use('/api/v1', router);

// Start server
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
