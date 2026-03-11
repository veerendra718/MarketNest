const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: {
            values: ["brand", "customer"],
            message: "{VALUE} is not a valid role"
        },
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);