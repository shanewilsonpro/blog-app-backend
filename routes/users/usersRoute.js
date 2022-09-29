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
  generateVerificationTokenController,
  accountVerificationController,
  forgetPasswordToken,
  passwordResetController,
  profilePhotoUploadController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/uploads/photoUpload");
const userRoutes = express.Router();

// register
userRoutes.post("/register", userRegisterController);

// login
userRoutes.post("/login", loginUserController);

// upload user profile photo
userRoutes.put(
  "/profilephoto-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadController
);

// fetch all users
userRoutes.get("/", authMiddleware, fetchUsersController);

// user profile
userRoutes.get("/profile/:id", authMiddleware, userProfileController);

// update user profile
userRoutes.put("/:id", authMiddleware, updateUserController);

// update user password
userRoutes.put("/password", authMiddleware, updateUserPasswordController);

// generate forget password token
userRoutes.post("/forget-password-token", forgetPasswordToken);

// reset user password
userRoutes.put("/reset-password", passwordResetController);

// send mail to user
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenController
);

// verify user account
userRoutes.put(
  "/verify-account",
  authMiddleware,
  accountVerificationController
);

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
