const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const generateToken = require("../../config/token/generateToken");
const User = require("../../models/user/User");
const validateMongodbId = require("../../utils/validateMongodbID");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//-------------------------------------
//Register
//-------------------------------------

const userRegisterController = expressAsyncHandler(async (req, res) => {
  //Check if user Exist
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) throw new Error("User already exists");
  try {
    //Register user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//Login user
//-------------------------------

const loginUserController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const userFound = await User.findOne({ email });
  //   //check if blocked
  //   if (userFound?.isBlocked)
  //     throw new Error("Access Denied You have been blocked");

  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
      isVerified: userFound?.isAccountVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

//------------------------------
//Users
//-------------------------------
const fetchUsersController = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete user
//------------------------------
const deleteUsersController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

//----------------
//user details
//----------------
const fetchUserDetailsController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//User profile
//------------------------------
const userProfileController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  //1.Find the login user
  //2. Check this particular if the login user exists in the array of viewedBy

  //Get the login user
  const loginUserId = req?.user?._id?.toString();
  console.log(typeof loginUserId);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
    // .populate("posts")
    // .populate("viewedBy");
    //   const alreadyViewed = myProfile?.viewedBy?.find(user => {
    //     console.log(user);
    //     return user?._id?.toString() === loginUserId;
    //   });
    //   if (alreadyViewed) {
    //     res.json(myProfile);
    //   } else {
    //     const profile = await User.findByIdAndUpdate(myProfile?._id, {
    //       $push: { viewedBy: loginUserId },
    //     });
    //     res.json(profile);
    //   }
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update profile
//------------------------------
const updateUserController = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  //block
  //   blockUser(req?.user);
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

//------------------------------
//Update password
//------------------------------
const updateUserPasswordController = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

//------------------------------
//following
//------------------------------
const followingUserController = expressAsyncHandler(async (req, res) => {
  //1.Find the user you want to follow and update it's followers field
  //2. Update the login user following field
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if the login id exist
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already followed this user");

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );
  res.json("You have successfully followed this user");
});

//------------------------------
//unfollow
//------------------------------
const unfollowUserController = expressAsyncHandler(async (req, res) => {
  const { unFollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unFollowId },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user");
});

//------------------------------
//Block user
//------------------------------

const blockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json(user);
});

//------------------------------
//Unblock user
//------------------------------

const unBlockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json(user);
});

//------------------------------
// Generate Email verification token
//------------------------------
const generateVerificationTokenController = expressAsyncHandler(
  async (req, res) => {
    const loginUserId = req.user.id;
    const user = await User.findById(loginUserId);

    try {
      //Generate token
      const verificationToken = await user?.createAccountVerificationToken();
      //save the user
      await user.save();
      console.log(verificationToken);
      //build your message
      const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;

      const msg = {
        to: user?.email,
        from: "shanewilsonpro@gmail.com",
        subject: "Verify your account",
        html: resetURL,
      };
      await sgMail.send(msg);
      res.json(resetURL);
    } catch (error) {
      res.json(error);
    }
  }
);

//------------------------------
//Account verification
//------------------------------
const accountVerificationController = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //find this user by token
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");
  //update the proprt to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});

module.exports = {
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
};
