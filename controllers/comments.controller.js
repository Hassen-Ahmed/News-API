const { removeCommentById, updateCommentsById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
};

exports.patchCommentsById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    updateCommentsById(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
};
