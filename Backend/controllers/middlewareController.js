const jwt = require("jsonwebtoken");

const middelwareController = {
  // verify token: xem chung nhan co phai la nguoi do ko - xac nhan token
  verifyToken: (req, res, next) => {
    const token = req.headers.token; // lấy token từ người dùng
    if (token) {
      const accessToken = token.split(" ")[1];
      // chung nhan token
      jwt.verify(accessToken, process.env.JWT_API_KEY, (err, user) => {
        if (err) {
          res.status(404).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(404).json("you're not authenticated");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middelwareController.verifyToken((req, res), () => {
      if (req.user.id == req.param.id || req.user.admin) {
        next();
      } else {
        req.status(403).json("you're not allowed to delete orther");
      }
    });
  },
};

module.exports = middelwareController;
