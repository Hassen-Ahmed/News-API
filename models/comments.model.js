const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
    return db
        .query(
            `DELETE FROM comments
             WHERE comment_id = $1 RETURNING *;`,
            [comment_id]
        )
        .then(({ rows }) => {
            if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        });
};

exports.updateCommentsById = (comment_id, inc_votes) => {
    const query = `
    UPDATE comments 
    SET votes = votes + ($1)
    WHERE comment_id = $2 RETURNING * ;`;
    const queryValues = [inc_votes, comment_id];

    return db.query(query, queryValues).then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        return rows[0];
    });
};
