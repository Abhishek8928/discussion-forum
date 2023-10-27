const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const userRouter = require("./Routes/user.js");
const postRouter = require("./Routes/post.js");
const path = require("path");
const User = require("./Models/user.js");
const Response = require("./Models/response.js");
const Post = require("./Models/post.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// options to config
const sessionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

// it help us to create a server -> port , callback function
app.listen(port, function () {
  console.log(`Server is running on port ${port} `);
})

// middleware -> for any request above middleware will work
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOption));
app.use(flash());
app.use(methodOverride('_method'))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
})






app.use("/posts", postRouter);
app.use("/", userRouter);



