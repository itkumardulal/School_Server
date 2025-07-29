const jwt = require("jsonwebtoken");
const { secretConfig } = require("../config/config");
const { admins, users } = require("../database/connection");

const Roles = Object.freeze({
  superAdmin: "superAdmin",
  admin: "admin",
});

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, secretConfig.secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      let userData;

      if (decoded.role === Roles.superAdmin) {
        userData = await admins.findByPk(decoded.id);
      } else if (decoded.role === Roles.admin) {
        userData = await users.findByPk(decoded.id);
      }

      if (!userData) {
        return res.status(404).json({ message: "No user with that ID found" });
      }

      req.user = userData; 
      req.userRole = decoded.role; 
      next();
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
};

const restrictedTo = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "You don't have Permission" });
    }
    next();
  };
};

module.exports = {isAuthenticated,restrictedTo,Roles}