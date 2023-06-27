exports.sqlErrorHandler = (err, req, res, next) => {
    if (err.code) res.status(400).send({ msg: "Invalid request!" });
    next(err);
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.msg) res.status(err.status || 404).send({ msg: err.msg || "Nor found!" });
    next(err);
};

exports.internalServerErrorHandler = (err, req, res, next) => {
    if (err.msg) res.status(err.status || 500).send({ msg: err.msg || "Internal server error!" });
};
