module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you are not logged in");
    res.redirect("/login");
    console.log("user is not logged in")
  }
  else {
    next();
  }
};
