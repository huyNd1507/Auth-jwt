const router = require("express").Router();
const middelwareController = require("../controllers/middlewareController");
const userController = require("../controllers/userControllers");

// Get All Users
router.get("/", middelwareController.verifyToken, userController.getAllUsers);

// Delete User
router.delete(
  "/:id",
  middelwareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
