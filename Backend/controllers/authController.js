const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });
    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 60 * 60 * 1000,
    });

    res.status(201).json({
        message: "User registered successfully",
        accessToken,
        user: {
            userId: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 60 * 60 * 1000,
    });

    res.json({
        message: "User logged in successfully",
        accessToken,
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});

const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token found" });
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
    user.refreshToken = null;
    await user.save();
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "User logged out successfully" });
});

const refreshTokens = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token found" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || refreshToken !== user.refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 60 * 60 * 1000,
    });
    res.status(200).json({
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});

module.exports = { register, login, logout, refreshTokens };
