const express = require('express');
const { userRegisterController, loginUserController } = require('../../controllers/users/usersController')

const userRoutes = express.Router();

// register
userRoutes.post('/register', userRegisterController);

// login
userRoutes.post('/login', loginUserController);

module.exports = userRoutes;