const { selectAllTopics } = require("../models/topics.model");
const { writeAllDescriptions } = require("../models/docs.model");

exports.getAllTopics = (req, res, next) => {
    let { method } = req;
    let { path } = req.route;

    writeAllDescriptions(`${method} ${path}`);

    return selectAllTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
};
