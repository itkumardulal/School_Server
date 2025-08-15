const express = require("express");
const app = express();

const adminSeeder = require("./adminSeeder");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "https://schooladmin-production.up.railway.app",
  "https://schoolbhawagatiwebsite-production.up.railway.app",
  "https://www.hamrobhagawati.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

adminSeeder();

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const newsRoutes = require("./src/routes/newsRoute");
const admissionRoutes = require("./src/routes/addmissionRoute");
const messageRoutes = require("./src/routes/messageRoute");
const noticeRoutes = require("./src/routes/noticeRoute");

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", newsRoutes);
app.use("/", admissionRoutes);
app.use("/", messageRoutes);
app.use("/", noticeRoutes);

module.exports = app;
