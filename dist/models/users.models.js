"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: "string", required: true, unique: true },
    googleId: { type: String, sparse: true },
    token: { type: String },
    // email: {type: "string", required: true},
    // _id: { type: "string", required: true},
    password: { type: "string", required: true },
    avatar: { type: "string" },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
