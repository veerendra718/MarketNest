const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) => {
    const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    return accessToken;
};

const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };