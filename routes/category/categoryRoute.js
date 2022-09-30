const express = require("express");
const {
  createCategoryController,
  fetchCategoriesController,
  fetchCategoryController,
  updateCategoryController,
  deleteCateoryController,
} = require("../../controllers/category/categoryController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleware, createCategoryController);
categoryRoute.get("/", fetchCategoriesController);
categoryRoute.get("/:id", fetchCategoryController);
categoryRoute.put("/:id", authMiddleware, updateCategoryController);
categoryRoute.delete("/:id", authMiddleware, deleteCateoryController);

module.exports = categoryRoute;
