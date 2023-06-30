const express = require("express");
const topicsRoute = express.Router();
const { getAllTopics } = require("../controllers/topics.controller");

topicsRoute.get("/", getAllTopics);

module.exports = topicsRoute;
