const express = require("express");
const articlesRoute = express.Router();
const {
    getArticlesById,
    getAllArticles,
    getCommentsByArticleId,
    postCommentById,
    patchArticleById,
} = require("../controllers/articles.controller");

articlesRoute.get("/", getAllArticles);
articlesRoute.route("/:article_id").get(getArticlesById).patch(patchArticleById);
articlesRoute.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentById);

module.exports = articlesRoute;
