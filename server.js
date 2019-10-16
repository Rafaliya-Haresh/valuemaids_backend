var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser');

// --
// Connect mongoose
//mongoose.connect('mongodb://localhost:27017/valuemaids'); 

var dbURI = 'mongodb+srv://hari:hari@cluster0-d1hip.mongodb.net/valuemaids';

mongoose.connect(dbURI, {useNewUrlParser: true}).then(
  () => {
	console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

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
require('./routes/webportal')(app);

// Start server
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
