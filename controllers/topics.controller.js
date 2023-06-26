const { selectAllTopics } = require("../models/topics.model");
const { writeAllDescriptions } = require("../models/docs.model");

function getAllTopics(req, res) {
    let { method } = req;
    let { path } = req.route;

    writeAllDescriptions(`${method} ${path}`);
    return selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
    });
}

module.exports = { getAllTopics };
