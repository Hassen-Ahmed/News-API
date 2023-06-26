const { readAllDescriptions } = require("../models/docs.model");

function getAllDescriptions(req, res, next) {
    return readAllDescriptions()
        .then((descriptions) => {
            let parsedDescriptions = JSON.parse(descriptions);
            res.status(200).send({ descriptions: parsedDescriptions });
        })
        .catch(next);
}

module.exports = { getAllDescriptions };
