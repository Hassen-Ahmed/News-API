const format = require("pg-format");
const db = require("../db/connection");

exports.selectAllTopics = () => {
    const query = "SELECT * FROM topics";

    return db
        .query(query)
        .then(({ rows }) => {
            return rows;
        })
        .catch((err) => {
            return Promise.reject({ status: 404, msg: "Not found" });
        });
};

exports.insertNewTopic = (slug, description) => {
    const query = `
    INSERT INTO topics
    (slug,description)
    VALUES %L RETURNING *;
    `;

    return db.query(format(query, [[slug, description]])).then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        return rows[0];
    });
};
