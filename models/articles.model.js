const db = require("../db/connection");

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
    const queryValue = [];

    return db.query(query, queryValue).then(({ rows }) => {
        return rows;
    });
};
