"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// export {};
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const messages_1 = __importDefault(require("./routes/messages"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// import http from "http";
// import { Server } from "socket.io";
// import cookieParser from "cookie-parser";
dotenv_1.default.config();
const app = (0, express_1.default)();
// const server = http.createServer(app);
// const io = new Server(server);
app.use((0, helmet_1.default)());
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
// sets file size limit, to ensure uploads can work - cloudinary
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
const PORT = process.env.PORT || 6002;
const source = process.env.MONGO_SOURCE;
mongoose_1.default.connect(`${source}`, {});
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const conn = yield mongoose_1.default.connect(source);
            console.log(`Mongo db connected`);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    });
})();
// const db = mongoose.connection;
const mongoStore = connect_mongo_1.default.create({
    mongoUrl: `${source}`,
    collectionName: "sessions",
    // mongooseConnection: db,
    ttl: 24 * 60 * 60,
});
// https://www.npmjs.com/package/connect-mongo
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
    store: mongoStore,
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, {
            username: user.username,
            id: user._id,
        });
    });
});
passport_1.default.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// io.on("connection", (socket) => {
//   // get token and verify with jwt
//   // const cookies = req.headers.cookie
//   socket.on("send", (username) => {
//     io.emit("send name", username);
//   });
//   // check users list, if new user send message about user online if (!users[userId])
//   socket.on("new message", (msg) => {
//     // let file: unknown = null;
//     // if (file) {
//     // }
//     io.emit("send message", { message: msg, user: socket.username });
//   });
//   socket.on("disconnect", (username) => {
//     console.log(`${username} disconnected`);
//   });
// });
app.use("/messages", messages_1.default);
app.use("/users", users_1.default);
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
