const userRouter = require('express').Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const User = require('../models/userModel');

userRouter.post('/signup', authController.signup(User));
userRouter.post('/login', authController.login(User));

userRouter
    .route('/')
    .get(authController.protect(User), userController.getUsers)
    .post(userController.postUser);

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.patchUser)
    .delete (userController.deleteUser);

module.exports = userRouter;
