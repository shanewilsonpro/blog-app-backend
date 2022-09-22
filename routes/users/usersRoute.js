const express = require("express");
const {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUsersController
} = require("../../controllers/users/usersController");

const userRoutes = express.Router();

// register
userRoutes.post("/register", userRegisterController);

// login
userRoutes.post("/login", loginUserController);

// fetch all users
userRoutes.get("/", fetchUsersController);

// delete an user
userRoutes.delete("/:id", deleteUsersController);

module.exports = userRoutes;
