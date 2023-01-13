const express = require("express");

const { createPost, updatePost, allPost } = require("../controllers/blogContrl");
const imageUp = require("../helpers/multer")

const blogRoutes = express.Router();

blogRoutes.route("/post").post(imageUp, createPost).get(allPost);
blogRoutes.route("/post/:id").patch(imageUp, updatePost)
module.exports = blogRoutes;