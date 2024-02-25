"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const jwtSecret = process.env.JWT_SECRET_KEY;
const saltRounds = 10;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getMessages = (req, res) => {
    const { id } = req.params;
    // find messages by recipient and sender
};
exports.getMessages = getMessages;
