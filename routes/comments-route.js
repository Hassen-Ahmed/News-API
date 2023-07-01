const express = require("express");
const commentsRoute = express.Router();
const { deleteCommentById, patchCommentsById } = require("../controllers/comments.controller");

commentsRoute.route("/:comment_id").delete(deleteCommentById).patch(patchCommentsById);

module.exports = commentsRoute;
