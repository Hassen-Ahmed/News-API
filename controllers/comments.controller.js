const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
};
