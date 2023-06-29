const { selectAllTopics } = require("../models/topics.model");

exports.getAllTopics = (_, res) => {
    return selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};
