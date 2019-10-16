'use strict';

var users = require('../controllers/users');
var express = require('express');
var router = express.Router();
var cors = require('cors');

router.use(cors());

router.get('/', function(req, res){
	return res.send('NodeJS API working');
});

router.post('/appointment/create', users.addAppointment);
router.get('/appointment', users.getAppointment);
router.post('/user/signin', users.signin);
router.post('/user/signup', users.signup);
router.get('/user/logout', users.logout);

module.exports = router;