const doctorRouter = require('express').Router();
const doctorController = require('../controller/doctorController');
const authController = require('../controller/authController');
const Doctor = require('../models/doctorModel');

doctorRouter.post('/signup', authController.signup(Doctor));
doctorRouter.post('/login', authController.login(Doctor));

doctorRouter
    .route('/')
    .get(doctorController.getDoctors)
    .post(doctorController.postDoctor);

doctorRouter
    .route('/:id')
    .get(doctorController.getDoctor)
    .patch(doctorController.patchDoctor)
    .delete (doctorController.deleteDoctor);

module.exports = doctorRouter;
