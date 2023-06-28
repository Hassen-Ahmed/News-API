const { validationResult } = require("../app");
const {
    selectArticlesById,
    selectAllArticles,
    selectCommentsByArticleId,
    insertCommentsByArticleId,
} = require("../models/articles.model");
const { checkArticleExist } = require("../models/check-exist-item");

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    return selectArticlesById(article_id)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
    let { article_id } = req.params;

    const promises = [selectCommentsByArticleId(article_id)];

    if (article_id) {
        promises.push(checkArticleExist(article_id, "articles", "article_id"));
    }

    return Promise.all(promises)
        .then((comments) => {
            res.status(200).send({ comments: comments[0] });
        })
        .catch(next);
};

exports.postCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const { user_name, body } = req.body;

    const promises = [insertCommentsByArticleId(article_id, body)];

    if (article_id) {
        promises.push(checkArticleExist(article_id, "articles", "article_id"));
    }
    if (user_name) {
        promises.push(checkArticleExist(user_name, "users", "username"));
    }

    return Promise.all(promises)
        .then((allPromises) => {
            const comments = allPromises[0];
            res.status(200).send({ comments });
        })
        .catch(next);
};
