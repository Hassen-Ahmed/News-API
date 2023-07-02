const { selectAllTopics, insertNewTopic } = require("../models/topics.model");

exports.getAllTopics = (_, res) => {
    return selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};

exports.postNewTopic = (req, res, next) => {
    const { slug, description } = req.body;
    insertNewTopic(slug, description)
        .then((topic) => {
            res.status(201).send({ topic });
        })
        .catch(next);
};
