const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const appointmentSchema = new mongoose.Schema({
    cat: {
        type: Date,
        default: Date.now(),
        select: false
    },
    userID: {
        type: String,
        required: [true, 'User ID is required']
    },
    doctorID: {
        type: String,
        required: [true, 'Doctor ID is required']
    },
    userFullName: {
        type: String,
        required: [true, 'User Full Name is required']
    },
    doctorFullName: {
        type: String,
        required: [true, 'Doctor Full Name is required']
    },
    accepted: {
        type: Boolean
    },
    completed: {
        type: Boolean,
        default: false
    },
    clinicName: {
        type: String
    },
    clinicLocation: {
        type: String
    },
    clinicFee: {
        type: Number
    },
    clinicTime: {
        type: Date
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
