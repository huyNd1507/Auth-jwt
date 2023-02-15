const authController = require("../controllers/authControllers");
const middelwareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requesRefreshToken);
router.post(
  "/logout",
  middelwareController.verifyToken,
  authController.logoutUser
);

module.exports = router;
