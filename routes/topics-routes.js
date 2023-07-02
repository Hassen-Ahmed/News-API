const express = require("express");
const topicsRoute = express.Router();
const { getAllTopics, postNewTopic } = require("../controllers/topics.controller");

topicsRoute.route("/").get(getAllTopics).post(postNewTopic);

module.exports = topicsRoute;
