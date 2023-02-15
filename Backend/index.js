const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("Connect to DB");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(8000, () => {
  console.log("Server is running");
});
