const { selectAllUsers } = require("../models/users.model");

exports.getAllUsers = (_, res) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users });
    });
};
