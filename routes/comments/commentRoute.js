const express = require("express");
const {
  createCommentController,
  fetchAllCommentsController,
  fetchCommentController,
  updateCommentController,
  deleteCommentController,
} = require("../../controllers/comments/commentController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentController);
commentRoutes.get("/", fetchAllCommentsController);
commentRoutes.get("/:id", authMiddleware, fetchCommentController);
commentRoutes.put("/:id", authMiddleware, updateCommentController);
commentRoutes.delete("/:id", authMiddleware, deleteCommentController);

module.exports = commentRoutes;
