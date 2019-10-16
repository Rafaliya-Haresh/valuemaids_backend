'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
    firstname: String,
    lastname: String,
    emailOrPhone: String,
    datetime: String
});

module.exports = mongoose.model('Appointment', appointmentSchema);