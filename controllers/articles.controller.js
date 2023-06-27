const { selectArticlesById, selectAllArticles } = require("../models/articles.model");

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
