const express = require("express");
const {
  sendEmailMsgController,
} = require("../../controllers/email-msg/emailMsgController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const emailMsgRoute = express.Router();

emailMsgRoute.post("/", authMiddleware, sendEmailMsgController);

module.exports = emailMsgRoute;
