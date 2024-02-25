"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    file: { type: String },
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.Message = Message;
