const express = require("express");
const articlesRoute = express.Router();
const {
    getArticlesById,
    getAllArticles,
    getCommentsByArticleId,
    postCommentById,
    patchArticleById,
    postArticle,
} = require("../controllers/articles.controller");

articlesRoute.route("/").get(getAllArticles).post(postArticle);

articlesRoute.route("/:article_id").get(getArticlesById).patch(patchArticleById);

articlesRoute.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentById);

module.exports = articlesRoute;
