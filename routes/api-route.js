const express = require("express");
const apiRoute = express.Router();
const descriptionsData = require("../endpoints.json");

// routes
const articlesRoute = require("./articles-route");
const commentsRoute = require("./comments-route");
const topicsRoute = require("./topics-routes");
const usersRoute = require("./users-route");

apiRoute.get("/", (_, res) => res.status(200).send(descriptionsData));
apiRoute.use("/articles", articlesRoute);
apiRoute.use("/topics", topicsRoute);
apiRoute.use("/comments", commentsRoute);
apiRoute.use("/users", usersRoute);

module.exports = apiRoute;
