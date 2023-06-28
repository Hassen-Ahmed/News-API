exports.sqlErrorHandler = (err, _, res, next) => {
    if (err.code) res.status(400).send({ msg: "Invalid request!" });
    next(err);
};

exports.customErrorHandler = (err, _, res, next) => {
    if (err.msg) res.status(err.status || 404).send({ msg: err.msg || "Nor found!" });
    next(err);
};

exports.internalServerErrorHandler = (err, _, res) => {
    if (err.msg) res.status(err.status || 500).send({ msg: err.msg || "Internal server error!" });
};
