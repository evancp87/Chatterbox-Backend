/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// export {};
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
// import messagesRouter from "./routes/messages";
import session from "express-session";
// import http from "http";
// import { Server } from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

// const server = http.createServer(app);
// const io = new Server(server);
app.use(helmet());
dotenv.config();
app.use(cors());

// app.use(csrfMiddleware());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// sets file size limit, to ensure uploads can work - cloudinary
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const PORT = process.env.PORT || 6002;

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

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
// app.use("/messages", messagesRouter);
app.use("/users", usersRouter);
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
