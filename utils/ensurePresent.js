exports.ensurePresent = (value, fieldName = "Bad request") => {
  if (value === undefined) {
    throw { status: 400, msg: fieldName };
  }
};
