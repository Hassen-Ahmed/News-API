const db = require("../db/connection");

exports.checkArticleExist = (value, table_name, column) => {
    let query = `SELECT * FROM ${table_name}
    WHERE ${column} = $1`;

    if (!value) {
        query += "::integer";
    }

    return db.query(query, [value || 1]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found!" });
        }
    });
};
