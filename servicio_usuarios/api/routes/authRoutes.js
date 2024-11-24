const express = require("express");
const {login, register} = require("../views/authController");
const verifyToken = require("../../middleware/auth")
const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);