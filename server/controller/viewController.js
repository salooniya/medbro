const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');

const handler = (fn) => async (req, res, next) => {
    fn(req, res, next).catch(err => {
        console.log(err)
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    });
};

const signToken = (actor, type) => {
    return jwt.sign({
        id: actor._id,
        fullName: `${actor.firstName} ${actor.lastName}`,
        passwordCat: parseInt(actor.passwordCat.getTime() / 1000, 10),
        type: type
    }, process.env.SECRET)
};

exports.currentActor = handler(async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        let decoded = token && await jwt.verify(token, process.env.SECRET);
        if (decoded && decoded.iat < decoded.passwordCat) decoded = {};
        req.actor = decoded;
    } catch (e) {
        console.log(e);
    }
    next();
});

exports.getHome = handler(async (req, res) => {
    res.status(200).render('Home', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type
    });
});

exports.getLogin = (async (req, res) => {
    if (req.actor) {
        res.redirect('/');
        return;
    }
    res.status(200).render('login');
});

exports.getUserSignup = handler(async (req, res) => {
    if (req.actor) {
        res.redirect('/');
        return;
    }
    res.status(200).render('user-signup');
});

exports.getDoctorSignup = handler(async (req, res) => {
    if (req.actor) {
        res.redirect('/');
        return;
    }
    res.status(200).render('doctor-signup');
});

exports.getResetPassword = handler(async (req, res) => {
    if (req.actor) {
        res.redirect('/');
        return;
    }
    res.status(200).render('reset-password');
});

exports.getVerifyEmail = handler(async (req, res) => {
    res.status(200).render('verify-email');
});

exports.getTermsOfService = (req, res) => {
    res.status(200).render('terms-of-service');
};

exports.getPrivacyPolicy = (req, res) => {
    res.status(200).render('privacy-policy');
};

exports.postLogin = handler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw Error('Email and Password are required');

    let actor, correct, Model = User, type = 'users';

    actor = await Model.findOne({ email: email }).select('+password +passwordCat');
    correct = actor && await bcrypt.compare(password, actor.password);

    if (!actor || !correct) {
        Model = Doctor;
        type = 'doctors'
        actor = await Doctor.findOne({ email: email }).select('+password +passwordCat');
        correct = actor && await bcrypt.compare(password, actor.password);
        if (!actor || !correct) throw Error('Incorrect Email or Password');
    }

    const token = await signToken(actor, type);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 90*24*60*60*1000),
        secure: false,
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.getDoctorProfile = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.actor.id);
    console.log(doctor)
    let timings = doctor.clinicTimings?.split(';').map(t => {
        t = t.split('-');
        return {
            from: t[0],
            to: t[1]
        }
    });
    if (!timings) {
        timings = [];
        for (let i = 0; i < 10; i++) timings[i] = {};
    }
    console.log(timings)
    res.status(200).render('doctor-profile', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        doctor,
        timings
    });
});

exports.getDoctorClinic = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.actor.id);
    // console.log(doctor)
    let timings = doctor.clinicTimings?.split(';').map(t => {
        t = t.split('-');
        return {
            from: t[0],
            to: t[1]
        }
    });
    if (!timings) {
        timings = [];
        for (let i = 0; i < 10; i++) timings[i] = {};
    }
    console.log(timings)
    res.status(200).render('doctor-clinic', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        doctor,
        timings
    });
});

exports.updateMeDoctor = handler(async (req, res) => {
    if (req.files) req.body.profilePhoto = req.files[0]?.filename;
    const body = {};
    for (const key in req.body) {
        if (req.body[key]) body[key] = req.body[key];
    }
    const doctor = await Doctor.findByIdAndUpdate(req.actor.id, body, {new: true});
    res.status(200).json({
        status: 'success',
        data: {doctor}
    });
});

exports.getLogout = handler(async (req, res) => {
    res.cookie('jwt', 'LoggedOut', {
        expires: new Date(Date.now() + 90*24*60*60*1000),
        httpOnly: true
    });
    res.redirect('/');
});

exports.getDoctor = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    // const timings = doctor.clinicTimings.split(';').map(t => {
    //     t = t.split('-');
    //     return {
    //         from: t[0],
    //         to: t[1]
    //     }
    // });
    res.status(200).render('doctor', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        doctor
    });
});

exports.getSearch = handler(async (req, res) => {
    let query = Doctor;
    if (req.query.speciality) query = query.find({ specializations: new RegExp(req.query.speciality, 'i') });
    if (req.query.location) query = query.find({ clinicLocation: new RegExp(req.query.location, 'i') });

    if (req.query.sort) {
        const inc = req.query.sort[0] === '-' ? -1 : 1;
        const sortField = inc === -1 ? req.query.sort.slice(1) : req.query.sort;
        query = query.sort({ [sortField]: inc });
    }

    const results = await query;
    console.log(req.query)
    res.status(200).render('search', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        results
    });
});

exports.bookAppointment = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    const appointment = await Appointment.create({
        userID: req.actor.id,
        doctorID: req.params.id,
        userFullName: req.actor.fullName,
        doctorFullName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        clinicTime: req.body.clinicTime,
        clinicName: doctor.clinicName,
        clinicFee: doctor.clinicFee,
        clinicLocation: doctor.clinicLocation
    });
    res.status(200).send({
        status: 'success',
        data: { appointment }
    });
});


exports.getDoctorAppointments = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.actor.id);
    const appointments = await Appointment.find({ doctorID: doctor._id }).sort({ clinicTime: 1 });
    res.status(200).render('doctor-appointments', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        doctor,
        appointments
    });
});

exports.patchAppointmentAccepted = handler(async (req, res) => {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send({
        status: 'success',
        data: { appointment }
    });
});

exports.getUserProfile = handler(async (req, res) => {
    const user = await User.findById(req.actor.id);
    res.status(200).render('user-profile', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        user
    });
});

exports.updateMeUser = handler(async (req, res) => {
    if (req.files) req.body.profilePhoto = req.files[0]?.filename;
    const body = {};
    for (const key in req.body) {
        if (req.body[key]) body[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.actor.id, body, {new: true});
    res.status(200).json({
        status: 'success',
        data: {user}
    });
});

exports.getUserAppointments = handler(async (req, res) => {
    const user = await User.findById(req.actor.id);
    const appointments = await Appointment.find({ userID: user._id }).sort({ clinicTime: 1 });
    res.status(200).render('user-appointments', {
        fullName: req.actor?.fullName,
        id: req.actor?.id,
        type: req.actor?.type,
        user,
        appointments
    });
});
