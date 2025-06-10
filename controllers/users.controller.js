const { selectUsers, selectUserByUsername } = require("../models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await selectUserByUsername(username);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
