const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticlesById = (article_id) => {
    let query = "SELECT * FROM articles WHERE article_id = $1";

    return db.query(query, [article_id]).then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        return rows;
    });
};

exports.selectAllArticles = () => {
    let query = `SELECT 
    articles.author, 
    title, 
    articles.article_id, 
    topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    COUNT(comments.author) AS comments_count  
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    ;
    `;
    return db.query(query).then(({ rows }) => {
        return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
    let query = `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at ASC;
    `;
    return db.query(query, [article_id]).then(({ rows }) => {
        return rows;
    });
};

exports.insertCommentsByArticleId = (article_id, body) => {
    const values = Object.values(body);
    return db
        .query(
            format(
                `INSERT INTO  comments 
                ( article_id, author, votes, created_at, body )VALUES %L RETURNING * ;`,
                [values]
            )
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
