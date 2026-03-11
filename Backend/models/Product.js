const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    images: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: {
            values: ["draft", "published", "archived"],
            message: "{VALUE} is not a valid status"
        },
        default: "draft"
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ["Topwear", "Bottomwear", "Footwear", "Accessories", "Winterwear"],
            message: "{VALUE} is not a valid category"
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);