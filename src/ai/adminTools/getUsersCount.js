const userModel = require("../../models/users.model.js");

const getUserCount = async () => {

  return await userModel.countDocuments();

};

module.exports = getUserCount;