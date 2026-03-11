const express = require("express");
const router = express.Router();

const { register, login, refreshTokens, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post('/refresh', refreshTokens);
router.post('/logout', logout);

module.exports = router;