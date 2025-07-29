const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { admins, users } = require("../database/connection");
const { secretConfig } = require("../config/config");

const isLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    let data = null;
    let role = null;


    data = await admins.findOne({ where: { email } });
    if (data) {
      role = "superAdmin";
    } else {
      data = await users.findOne({ where: { email } });
      if (data) {
        role = "admin";
      }
    }

    if (!data || !role) {
      return res.status(404).json({ message: "No user with that email" });
    }

    const isAuthenticated = bcrypt.compareSync(password, data.password);
    if (!isAuthenticated) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const tokenPayload = {
      id: data.id,
      role,
      ...(role === "admin" ? { school_domain: data.school_domain } : {}),
    };

    const token = jwt.sign(tokenPayload, secretConfig.secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: data.id,
        role,
        ...(role === "admin" ? { school_domain: data.school_domain } : {}),
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyToken = (req, res) => {
  if (!req.user || !req.userRole) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.userRole,
      ...(req.userRole === "admin" ? { school_domain: req.user.school_domain } : {}),
    },
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { isLogin, verifyToken, logout };
