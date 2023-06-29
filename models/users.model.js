const db = require("../db/connection");
exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};
