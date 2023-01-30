const express = require("express");
const Router = express.Router();
const decodeToken = require("../middleware/decodeToken");
// Import All Controller
const { usersControllers } = require("../controllers"); // Akan otomatis mengambil file index.js nya

Router.post("/register", usersControllers.register);
Router.get("/login", usersControllers.login);
Router.patch("/changePassword", usersControllers.changePassword);
Router.get("/get", decodeToken, usersControllers.getDataUser);
Router.patch("/modify/:id", decodeToken, usersControllers.modify);
module.exports = Router;
