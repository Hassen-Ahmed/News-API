const { use } = require("../app");
const users = require("../db/data/test-data/users");
const { selectAllUsers, selectUserByUsername } = require("../models/users.model");

exports.getAllUsers = (_, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;

    selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(next);
};
