const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema({
    cat: {
        type: Date,
        default: Date.now(),
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
        select: false
    },
    passwordCat: {
        type: Date,
        select: false
    },
    profilePhoto: {
        type: String,
        default: 'default.png'
    },
    experience: {
        type: Number
    },
    qualifications: {
        type: String
    },
    specializations: {
        type: String
    },
    description: {
        type: String
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
    clinicTimings: {
        type: String
    }
});

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordCat = Date.now();
    next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
