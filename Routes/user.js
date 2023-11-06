

const express = require("express");
const Router = express.Router();
const User = require("../Models/user.js");
const passport = require("passport")

const isLogged = require("../Middleware/loggedin.js")
/* 
  Two step process
  1. render the login page that contain form
  2. get the data inside the /login routes with method=post
*/

Router.get("/", (req, res) => {
    res.render("./posts/index.ejs")
})


Router.get("/login",isLogged, (req, res) => {
    res.render("./users/login.ejs");
})
Router.post("/login",
    passport.authenticate('local', { failureRedirect: "/login",failureFlash:true}),
    async (req, res) => {
    res.redirect(`/posts`)
})

Router.get("/signup",isLogged, (req, res) => {
    res.render("./users/signup.ejs");
})
Router.post("/signup",async (req, res) => {
    try {
        let { name, username, password, email,avatar } = req.body.newUser;
        let newUser = new User({
        avatar:avatar,
        name: name,
        email:email,
        username: username
    })
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Something went wrong");
                res.redirect("/login");
            }
            req.flash("success", "Welcome to the devnest");
            res.redirect("/posts");
        })
        
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
})
Router.get("/profile", function (req, res, next){
    (req.user) ? next() : res.redirect("/login")
}, async (req, res) => {
    let user = await User.findById(req.user._id);
    res.render("./users/profile.ejs",{user})
})


module.exports = Router;