const fs = require("fs/promises");
const descriptionTemplateData = require("../description-templet");

function readAllDescriptions() {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
        return data;
    });
}

function writeAllDescriptions(methodAndUrl) {
    readAllDescriptions().then((descriptions) => {
        let convertedDesc = JSON.parse(descriptions);

        convertedDesc[methodAndUrl] = descriptionTemplateData[methodAndUrl];

        return fs.writeFile(`${__dirname}/../endpoints.json`, JSON.stringify(convertedDesc));
    });
}

module.exports = { readAllDescriptions, writeAllDescriptions };
