const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');

const handler = (fn) => async (req, res, next) => {
    fn(req, res, next).catch(err => {
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

exports.signup = (Model) => handler(async (req, res) => {
    const actor = await Model.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    let type;
    if (Model === User) type = 'users';
    else if (Model === Doctor) type = 'doctors';
    const token = await signToken(actor, type);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 90*24*60*60*1000),
        secure: false,
        httpOnly: true
    });

    if (Model === User) res.status(201).json({
        status: 'success',
        token,
        data: { user: actor }
    });

    if (Model === Doctor) res.status(201).json({
        status: 'success',
        token,
        data: { user: actor }
    });
});

exports.login = (Model) => handler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw Error('Email and Password are required');

    let actor, correct;

    actor = await Model.findOne({ email: email }).select('+password +passwordCat');
    correct = actor && await bcrypt.compare(password, actor.password);

    if (!actor || !correct) {
        actor = await Model.findOne({ email: email }).select('+password +passwordCat');
        correct = actor && await bcrypt.compare(password, actor.password);
        if (!actor || !correct) throw Error('Incorrect Email or Password');
    }

    const token = await signToken(actor);
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

exports.protect = (Model, error = true) => handler(async (req, res, next) => {
    const auth = req.headers.authorization;
    const token = (auth && auth.split(' ')[1]) || req.cookies.jwt;
    if (!token && error) throw Error('Invalid authorization');

    const decoded = await jwt.verify(token, process.env.SECRET);
    const actor = await Model.findById(decoded.id).select('+cat +passwordCat');
    if (!actor && error) throw Error('Token no longer exists');

    const passwordCatTimestamp = parseInt(actor.passwordCat.getTime() / 1000, 10);
    const jwtTimestamp = decoded.iat;
    if ((jwtTimestamp < passwordCatTimestamp) && error) throw Error('Password changed, login again to access');

    req.user = actor;
    next();
});
