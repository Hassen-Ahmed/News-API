const db = require("../db/connection");

exports.checkArticleExist = (article_id, table_name, column) => {
    return db
        .query(
            `SELECT * FROM ${table_name}
             WHERE ${column} = $1;`,
            [article_id]
        )
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found!" });
            }
            // return rows;
        });
};
