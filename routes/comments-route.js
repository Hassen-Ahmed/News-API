const express = require("express");
const commentsRoute = express.Router();
const { deleteCommentById } = require("../controllers/comments.controller");

commentsRoute.delete("/:comment_id", deleteCommentById);

module.exports = commentsRoute;
