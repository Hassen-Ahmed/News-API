const db = require("../db/connection");

exports.selectArticlesById = (article_id) => {
    let query = "SELECT * FROM articles WHERE article_id = $1";

    return db.query(query, [article_id]).then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        return rows;
    });
};
