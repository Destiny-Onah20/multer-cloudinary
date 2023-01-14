const express = require("express");
const { signUp } = require("../controllers/signUp");

const signRoute = express.Router();

signRoute.route("/user").post(signUp);

module.exports = signRoute;