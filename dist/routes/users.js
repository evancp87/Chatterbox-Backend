"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const users_1 = require("../controllers/users");
router.post("/register", (0, express_validator_1.query)("username", "password").notEmpty().escape(), users_1.registerUser);
router.get("/logout", users_1.logoutUser);
// router.get("/profile", userDetails);
router.get("/friends", users_1.friendsList);
router.get("/friends/:id", users_1.friend);
// router.post("/refresh", friendsList);
router.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
router.get("/login", (req, res) => {
    res.send("Login Page");
});
router.post("/login", passport_1.default.authenticate("local"), 
// {
//   successRedirect: "/",
//   failureRedirect: "/login",
// },
(req, res) => {
    if (req.user) {
        const { token, _id } = req.user;
        console.log(req.user, "checking the user");
        res
            .cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .json({ id: _id });
        // res.redirect("/login");
    }
});
router.post("/register", passport_1.default.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
}));
router.get("/protected", (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    passport_1.default.authenticate("jwt", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send("You are not authorized to view this");
        }
        res.status(200).send("Web page data");
    })(req, res, next);
});
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
exports.default = router;
