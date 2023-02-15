const User = require("../models/User");

const userController = {
  // Get All Users
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Delete User
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("xoa thanh cong");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
