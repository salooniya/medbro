const Doctor = require('../models/doctorModel');

const handler = (fn) => async (req, res, next) => {
    fn(req, res, next).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    });
};

exports.getDoctors = handler(async (req, res) => {
    const doctors = await Doctor.find();
    res.status(200).json({
        status: 'success',
        length: doctors.length,
        data: {doctors}
    });
});

exports.postDoctor = handler(async (req, res) => {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {doctor}
    });
});

exports.getDoctor = handler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {doctor}
    });
});

exports.patchDoctor = handler(async (req, res) => {
    if (req.files) req.body.profilePhoto = req.files[0].filename;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
        status: 'success',
        data: {doctor}
    });
});

exports.deleteDoctor = handler(async (req, res) => {
    const doctor = await Doctor.findByIdAndRemove(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {doctor}
    });
});
