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
exports.friend = exports.friendsList = exports.logoutUser = exports.registerUser = void 0;
/* eslint-disable no-console */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_jwt_1 = require("passport-jwt");
// import joi from "joi";
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const saltRounds = 10;
const users_models_1 = require("../models/users.models");
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET_KEY;
console.log(jwtSecret, "checking the secret");
// Joi schema for server side validation
// const schema = joi.object({
//     firstName: joi.string().min(1).max(50),
//     lastName: joi.string().min(1).max(50),
//     email: joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }).required(),
//     password: joi.string().min(5).max(40).regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/).messages({
//       'string.pattern.base': 'Password must contain at least one number'}).required(),
//       avatar: joi.string().allow(null).optional(),
//   });
const secret = process.env.JWT_SECRET_KEY;
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_models_1.User.findById(jwtPayload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
})));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // sanitising user input
    // const data = matchedData(req);
    // const result = validationResult(req);
    // if (result.isEmpty()) {
    //   return res.send(`Hello, ${req.query.person}!`);
    // }
    // res.send({ errors: result.array() });
    if (!username ||
        typeof username !== "string" ||
        !password ||
        typeof password !== "string") {
        res.status(403).send("Please enter correct credentials");
        return;
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = new users_models_1.User({
            username,
            password: hashedPassword,
        });
        const duplicateUser = yield users_models_1.User.findOne({ username });
        if (duplicateUser) {
            res
                .status(400)
                .send(`${duplicateUser} is already taken, please choose another username`);
            return;
        }
        // const token = jwt.sign({ id: newUser._id, username }, jwtSecret, { sameSite: "none", secure: true, expiresIn: "2h" }).then((err, token) => {
        // if (error) {
        // throw new Error(error);
        // res.cookie("token",token).status(201).json({_id: newUser._id});
        // }
        // });
        yield newUser.save();
        res.status(200).send({ message: "user created successfully", newUser });
    }
    catch (error) {
        console.error("There was an error", error);
        if (error)
            throw error;
        res.status(500).send(error);
    }
});
exports.registerUser = registerUser;
// TODO: tidy up and potentially move these files
// passport-local
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_models_1.User.findOne({ username });
        if (!user) {
            return done(null, false);
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return done(null, false);
        }
        jsonwebtoken_1.default.sign({ username: user.username, userId: user._id }, jwtSecret, {}, (err, token) => {
            if (err) {
                return done(err);
            }
            if (token) {
                user.token = token;
            }
        });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
// app.post(
//   "/login",
//   passport.authenticate(
//     "local",
//     { failureRedirect: "/login" },
//     (req: Request, res: Response) => {
//       res.redirect("/");
//     },
//   ),
// );
// app.post(
//   "/register",
//   passport.authenticate(
//     "local",
//     { failureRedirect: "/login" },
//     (req: Request, res: Response) => {
//       res.redirect("/");
//     },
//   ),
// );
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_CLIENT_CALLBACK_URL;
if (!googleClientId || !googleClientSecret || !googleCallbackURL) {
    throw new Error("Google OAuth environment variables are not properly set");
}
passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackURL,
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield users_models_1.User.findOne({ googleId: profile.id });
            // TODO: if user already exists, handle
            if (!user) {
                user = yield users_models_1.User.create({
                    googleId: profile.id,
                });
            }
            return cb(null, user);
        }
        catch (error) {
            return cb(error);
        }
    });
}));
const logoutUser = (req, res) => {
    req.logout({}, (err) => {
        if (err) {
            console.error("Logout error", err);
            return;
        }
        res.redirect("/login");
    });
};
exports.logoutUser = logoutUser;
// const userDetails = (req: Request, res: Response) => {
//   const token = res.cookie?.token;
//   if (token){
//   jwt.verify({token, jwtSecret, {}, (error, result) => {
//     if (err) throw new Error(err);
//     const {id, username} = result;
//     res.status(200).send({id, username});
//   }})}
// };
const friendsList = () => { };
exports.friendsList = friendsList;
const friend = () => { };
exports.friend = friend;
//  TODO: get profile data;
