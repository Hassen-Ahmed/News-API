const express = require("express");
const { getAllTopics } = require("./controllers/topics.controller");
const app = express();

app.use((req, res, next) => {
    const path = req.url.split("/");

    if (path.includes("topics")) {
        next();
    } else {
        res.status(404).send({ msg: "Not found!" });
    }
});

app.get("/api/topics", getAllTopics);

module.exports = app;
