const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let refreshTokens = []; // tao tuong tu giong database
const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // Save to db
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // GENNERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_API_KEY,
      { expiresIn: "30s" } // thơi gian token het han
    );
  },

  // GENNERATE REFESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" } // thơi gian token het han
    );
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      // tim user
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong username!");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        res.status(404).json("wrong password!");
      }
      if (user && validPassword) {
        const acessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...orthers } = user._doc;
        res.status(200).json({ ...orthers, acessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //REFRESH TOKEN
  requesRefreshToken: async (req, res) => {
    // Lấy refresh token từ user
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json("you are not authenticated!");

    // if (!refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json("Refresh token is not valid!");
    // }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      // loc token cu ra lay token moi
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new access token, refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken); // luu vao db

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({ acessToken: newAccessToken });
    });
  },

  // LOG OUT
  logoutUser: async (req, res, next) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter((token) => {
      return token !== req.cookies.refreshToken;
    });
    res.status(200).json("Logout thanh cong ");
  },
};

module.exports = authController;

// REDUX STORE -> ACESSTOKEN
// HTTP ONLY -> REFRESHTOKEN
