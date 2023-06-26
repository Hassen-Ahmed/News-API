const db = require("../db/connection");

function selectAllTopics() {
    const query = "SELECT * FROM topics";

    return db
        .query(query)
        .then(({ rows }) => {
            return rows;
        })
        .catch((err) => {
            return Promise.reject({ status: 404, msg: "Not found" });
        });
}

module.exports = { selectAllTopics };
