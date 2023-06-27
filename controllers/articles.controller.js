const { selectArticlesById } = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    return selectArticlesById(article_id)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};
