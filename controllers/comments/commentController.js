const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../models/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbID");

//-------------------------------------------------------------
//Create
//-------------------------------------------------------------
const createCommentController = expressAsyncHandler(async (req, res) => {
  //1.Get the user
  const user = req.user;

  //2.Get the post Id
  const { postId, description } = req.body;

  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//fetch all comments
//-------------------------------
const fetchAllCommentsController = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//commet details
//------------------------------
const fetchCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update
//------------------------------
const updateCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//delete comment
//------------------------------
const deleteCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  deleteCommentController,
  updateCommentController,
  createCommentController,
  fetchAllCommentsController,
  fetchCommentController,
};