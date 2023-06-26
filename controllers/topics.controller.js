const { selectAllTopics } = require("../models/topics.model");

function getAllTopics(req, res) {
    return selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
    });
}

module.exports = { getAllTopics };
