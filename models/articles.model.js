const format = require("pg-format");
const db = require("../db/connection");
exports.selectArticlesById = (article_id) => {
    let query = `SELECT 
    articles.article_id, 
    title, 
    topic, 
    articles.author, 
    articles.body, 
    articles.created_at, 
    articles.votes, 
    article_img_url,
    count(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments  ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `;

    return db.query(query, [article_id]).then(({ rows }) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
        return rows[0];
    });
    // let query = "SELECT * FROM articles WHERE article_id = $1";

    // return db.query(query, [article_id]).then(({ rows }) => {
    //     if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
    //     return rows;
    // });
};

exports.selectAllArticles = async (topic, sort_by = "created_at", order = "desc") => {
    const fetchingTopicsInArticles = await db
        .query(`SELECT DISTINCT topic FROM articles;`)
        .then(({ rows }) => {
            let topics = rows.map((row) => row.topic);
            return topics;
        });

    const greenList = [
        "ASC",
        "DESC",
        "asc",
        "desc",
        ...fetchingTopicsInArticles,
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
    ];

    let query = `SELECT articles.author, title, 
                 articles.article_id, topic, 
                 articles.created_at, articles.votes, articles.article_img_url, 
                 COUNT(comments.author) AS comments_count  
                 FROM articles 
                 LEFT JOIN comments ON comments.article_id = articles.article_id `;

    const queryValues = [];

    if (topic) {
        if (!greenList.includes(topic)) {
            return db.query(`select * from topics where slug = $1`, [topic]).then(({ rows }) => {
                if (rows) return Promise.reject({ status: 404, msg: "Not found!" });
            });
        }
        query += `\nWHERE topic = $1 `;
        queryValues.push(topic);
    }

    const isSame = sort_by === "body";
    if (sort_by && !greenList.includes(sort_by))
        return Promise.reject({
            status: isSame ? 404 : 400,
            msg: isSame ? "Not found!" : "Bad request",
        });

    if (order && !greenList.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    query += `GROUP BY articles.article_id ${
        sort_by ? `ORDER BY ${sort_by} ${order}; ` : "ORDER BY articles.article_id DESC"
    };`;

    return await db.query(query, queryValues).then(({ rows }) => rows);
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

exports.postCommentsByArticleId = (article_id, body) => {
    return db
        .query(
            `UPDATE comments
                    SET body = $1 
                    WHERE article_id = $2 RETURNING *;`,
            [body, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateArticleById = (article_id, inc_votes) => {
    return db
        .query(
            `UPDATE articles 
        SET votes = votes + ($1) 
        WHERE article_id = $2 RETURNING *;`,
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            if (!rows.length) return Promise.reject({ status: 404, msg: "Not found!" });
            return rows[0];
        });
};

exports.insertArticle = async ({ title, topic, author, body }) => {
    const query = `
    INSERT INTO articles 
    (title, topic, author, body)
    VALUES %L RETURNING *;
    `;
    return await db.query(format(query, [[title, topic, author, body]])).then(async ({ rows }) => {
        const queryForCount = `
        SELECT
        count(comments.article_id) AS comment_count
        FROM
        articles 
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY (articles.article_id);
        `;
        const comment_count = await db.query(queryForCount, [rows[0].article_id]);

        const article = rows[0];
        article.comment_count = comment_count.rows[0].comment_count;
        return article;
    });
};
