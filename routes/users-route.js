const express = require("express");
const usersRoute = express.Router();
const { getAllUsers, getUserByUsername } = require("../controllers/users.controller");

usersRoute.get("/", getAllUsers);
usersRoute.get("/:username", getUserByUsername);

module.exports = usersRoute;
