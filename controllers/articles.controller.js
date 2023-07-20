const {
    selectArticlesById,
    selectAllArticles,
    selectCommentsByArticleId,
    postCommentsByArticleId,
    updateArticleById,
    insertArticle,
    deleteArticlesById,
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
    const { topic, sort_by, order } = req.query;
    const { limit, p } = req.query;
    selectAllArticles(topic, sort_by, order, limit, p)
        .then((articlesData) => {
            res.status(200).send({
                articles: articlesData.articles,
                totalArticles: articlesData.totalArticles,
            });
        })
        .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { limit, p } = req.query;

    return selectCommentsByArticleId(article_id, limit, p)
        .then((comments) => {
            res.status(200).send({ comments: comments });
        })
        .catch(next);
};

exports.postCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    const promises = [
        postCommentsByArticleId(article_id, body, username),
        checkArticleExist(username, "users", "username"),
    ];

    if (article_id) {
        promises.push(checkArticleExist(article_id, "articles", "article_id"));
    }

    return Promise.all(promises)
        .then((allPromises) => {
            const comments = allPromises[0];
            res.status(201).send({ comments });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    const promises = [updateArticleById(article_id, inc_votes)];
    const requestBodyProperties = Object.entries(req.body);

    if (!requestBodyProperties.length === 1)
        return Promise.reject({ status: 400, msg: "Invalid request!" });

    return Promise.all(promises)
        .then((allPromiseResult) => {
            const article = allPromiseResult[0];
            res.status(200).send({ article });
        })
        .catch(next);
};

exports.postArticle = (req, res, next) => {
    const { body } = req;
    insertArticle(body)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch(next);
};

exports.removeArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    deleteArticlesById(article_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
};
