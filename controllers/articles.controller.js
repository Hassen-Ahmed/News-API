const {
    selectArticlesById,
    selectAllArticles,
    selectCommentsByArticleId,
} = require("../models/articles.model");
const { checkArticleExist } = require("../models/check-exiting-item");

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
        promises.push(checkArticleExist(article_id));
    }

    return Promise.all(promises)
        .then((comments) => {
            res.status(200).send({ comments: comments[0] });
        })
        .catch(next);
};
