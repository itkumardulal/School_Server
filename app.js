const express = require("express");
const app = express();

const adminSeeder = require("./adminSeeder");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// adminSeeder();

const authRoutes = require("./src/routes/authRoute");
const userRoutes = require('./src/routes/userRoute')
const newsRoutes = require('./src/routes/newsRoute')
const admissionRoutes = require('./src/routes/addmissionRoute')
const messageRoutes = require('./src/routes/messageRoute')

app.use("/", authRoutes);
app.use('/', userRoutes)
app.use('/', newsRoutes);
app.use('/',admissionRoutes)
app.use('/',messageRoutes)

module.exports = app;
