//! Custom || 404
exports.customErrors = (err, req, res, next) => {
  if (err.status) return res.status(err.status).send({ msg: err.msg });
  else next(err);
};
//!  PSQL || 400
exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502")
    return res.status(400).send({ msg: "Bad request" });
  else next(err);
};

//! Server crash || 500
exports.serverErrors = (err, req, res, next) => {
  console.error(err); // Optional: for debugging unknown errors
  res.status(500).send({ msg: "Internal Server Error" });
};
