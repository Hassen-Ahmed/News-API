const express = require("express");
const usersRoute = express.Router();
const { getAllUsers } = require("../controllers/users.controller");

usersRoute.get("/", getAllUsers);

module.exports = usersRoute;
