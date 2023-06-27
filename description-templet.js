module.exports = {
    // all
    "GET /api": {
        description: "serves up a json representation of all the available endpoints of the api",
    },
    // topics
    "GET /api/topics": {
        description: "It will help us to get all topics with appropriate properties",
        queries: [],
        exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
        },
    },
    // articles
    "GET /api/articles": {
        description: "serves an array of all articles",
        queries: ["author", "topic", "sort_by", "order"],
        exampleResponse: {
            articles: [
                {
                    title: "Seafood substitutions are increasing",
                    topic: "cooking",
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: "2018-05-30T15:59:13.341Z",
                    votes: 0,
                    comment_count: 6,
                },
            ],
        },
    },
    "GET /api/articles/:article_id": {
        description: "It will help us to get all articles which there article_id === :article_id ",
        queries: [],
        exampleResponse: {
            articles: [
                {
                    title: "Seafood substitutions are increasing",
                    topic: "cooking",
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: "2018-05-30T15:59:13.341Z",
                    votes: 0,
                    comment_count: 6,
                },
            ],
        },
    },
    "PATCH /api/articles/:article_id": {
        description: "It will help us to patch/update specific part from articles table",
        queries: [],
        exampleResponse: {
            articles: [
                {
                    title: "Seafood substitutions are increasing",
                },
            ],
        },
    },
    // users
    "GET /api/users": {
        description:
            "It will help us to get all users from users table which have appropriate properties",
        queries: [],
        exampleResponse: {
            users: [
                {
                    username: "butter_bridge",
                    name: "jonny",
                    avatar_url:
                        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
            ],
        },
    },
    // comments
    "GET /api/articles/:article_id/comments": {
        description: "It will help us to get all comments with right article_id",
        queries: [],
        exampleResponse: {
            comments: [
                {
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 16,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: 1586179020000,
                },
            ],
        },
    },
    "DELETE /api/comments/:comment_id": {
        description:
            "It will delete comments from table when if comments table have comment_id equal to the params id i.e /:comment_id ",
        queries: [],
        exampleResponse: [],
    },
    "POST /api/articles/:article_id/comments": {
        description: "It will us to post/update new comment to comments table by article_id",
        queries: [],
        exampleResponse: {
            comments: [
                {
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 16,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: 1586179020000,
                },
            ],
        },
    },
};
