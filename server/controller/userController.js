const User = require('../models/userModel');

const handler = (fn) => async (req, res, next) => {
    fn(req, res, next).catch(err => {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    });
};

exports.getUsers = handler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: {users}
    });
});

exports.postUser = handler(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {user}
    });
});

exports.getUser = handler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {user}
    });
});

exports.patchUser = handler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
        status: 'success',
        data: {user}
    });
});

exports.deleteUser = handler(async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {user}
    });
});
