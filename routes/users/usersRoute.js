const express = require("express");
const {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUsersController,
  fetchUserDetailsController,
  userProfileController,
  updateUserController,
  updateUserPasswordController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

// register
userRoutes.post("/register", userRegisterController);

// login
userRoutes.post("/login", loginUserController);

// fetch all users
userRoutes.get("/", authMiddleware, fetchUsersController);

// user profile
userRoutes.get("/profile/:id", authMiddleware, userProfileController);

// update user profile
userRoutes.put("/:id", authMiddleware, updateUserController);

// update user password
userRoutes.put("/password", authMiddleware, updateUserPasswordController);

// delete an user
userRoutes.delete("/:id", deleteUsersController);

// fetch user details
userRoutes.get("/:id", fetchUserDetailsController);

module.exports = userRoutes;
