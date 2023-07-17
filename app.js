const cors = require("cors");
const express = require("express");
const app = express();
const apiRoute = require("./routes/api-route");
const { sqlErrorHandler, customErrorHandler, internalServerErrorHandler } = require("./errors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRoute);
app.all("*", (req, res) => {
    res.status(404).send({ msg: "Not found!" });
});
app.use(sqlErrorHandler);
app.use(customErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
