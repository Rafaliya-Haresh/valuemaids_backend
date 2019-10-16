'use strict';
var passport = require('passport'),
	nodemailer = require("nodemailer"),
	User = require('../models/users'),
	Appointment = require('../models/appointments');

function validateEmailAddress(email) {
	var expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	return expression.test(String(email).toLowerCase());
}
var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "",
		pass: ""
	}
});

exports.addAppointment = function(req, res) {
	let msgArray = '';
	let err = false;
	let email = '';
	if(!req.body.firstname){
		err = true;
		msgArray += 'Firstname is Required <br>';
	}
	if(!req.body.lastname){
		err = true;
		msgArray += 'Lastname is Required <br>';
	}
	if(!req.body.datetime){
		err = true;
		msgArray += 'DateTime is Required <br>';
	}

	if(!req.body.emailOrPhone){
		err = true;
		msgArray += 'Email or Phone is Required <br>';
	}

	if(isNaN(req.body.emailOrPhone)){
		email = req.body.emailOrPhone;
		if(req.body.emailOrPhone != '' && !validateEmailAddress(req.body.emailOrPhone)){
			err = true;
			msgArray += 'Email is Wrong';
		}
	}
	if(err){
		return res.send({status: false, message: msgArray});
	}
	Appointment.create(req.body,function(err, result){
		if(err){
			return res.status(400).send(err);
		}
		return res.status(200).send({status: true});
		if(email != ''){
			// var mailOptions= {
			//     to : req.body.email,
			//     subject : 'Value Maids',
			//     text : 'I m just testing'
			// }
			
			// smtpTransport.sendMail(mailOptions, function(error, response){
			// 	if(error){
			// 		console.log(error);
			// 		res.end("error");
			// 	}else{
			// 		console.log("Message sent: " + response.message);
			// 		res.end("sent");
			// 	}
			// })
		}
	});
}

// --
// User login
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return res.status(500).send(err);
		};

		if (info) {
			return res.status(401).send(info);
		};

		delete user.password;

		req.login(user, function(err) {
			if (err) {
				res.status(500).send(err);
			} else {
				return res.status(200).send({ message: "User has been loggedin successfully." });
			}
		});
	})(req, res, next);
};

// --
// User signup
exports.signup = function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			return res.status(400).send(err);
		};

		if (info) {
			return res.status(400).send(info);
		};
		res.end();
	})(req, res, next);
};


// --
// User logout
exports.logout = function(req, res, next) {
	req.logout();
	req.session.destroy();
	return res.status(200).send({ message: "User has been logout successfully." });
};


// 
// Get Users
exports.getAppointment = function(req, res){
	Appointment.find({}, function(err, result){
		if(err){
			return res.status(400).send(err);
		}
		if(!result){
			return res.status(200).send({'data': 'No any Data'});	
		}
		return res.status(200).send(result);
	});
}