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
  followingUserController,
  unfollowUserController,
  blockUserController,
  unBlockUserController,
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

// follow user
userRoutes.put("/follow", authMiddleware, followingUserController);

// unfollow user
userRoutes.put("/unfollow", authMiddleware, unfollowUserController);

// block user
userRoutes.put("/block-user/:id", authMiddleware, blockUserController);

// unblock user
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserController);

// delete an user
userRoutes.delete("/:id", deleteUsersController);

// fetch user details
userRoutes.get("/:id", fetchUserDetailsController);

module.exports = userRoutes;
