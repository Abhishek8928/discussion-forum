const express = require("express");
const Router = express.Router({ strict: true });
const Response = require("../Models/response");
const Post = require("../Models/post.js");
const User = require("../Models/user.js");
const isLogged = require("../Middleware/Authenticate");

// posts routes -> to showcase all the posts
Router.get("/", async (req, res) => {
  let allPost = await Post.find().populate("createdBy").populate({
    path: "response", // Populate 'response' field
    model: "Response", // Model to reference
    populate: {
      path: "responsedBy", // Populate 'responsedBy' field within 'response'
      model: "User", // Model to reference
    },
  });
  allPost.reverse();
  for (let post of allPost) {

    for (let i = 0; i < post.response.length; i++) {

       console.log(post?.response[i])
    }
  }
  function formatRelativeTime(originalTimestamp) {
    const currentTimestamp = new Date();
    const timeDifference = currentTimestamp - originalTimestamp;

    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
      return "asked less than a minute ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `asked ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `asked ${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `asked ${days} day${days > 1 ? "s" : ""} ago`;
    }

    // If the post is older than a week, return the actual date and time
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return originalTimestamp.toLocaleDateString(undefined, options);
  }

  res.render("./posts/dashboard.ejs", {
    allPost,
    formatRelativeTime: formatRelativeTime,
  });
});
Router.post("/show/:id", async (req, res) => {
  let { id } = req.params;
  let data = await new Response(req.body.post);
  data.responsedBy = req.user._id;
  data.save();
  let post = await Post.findById(id);
  post.response.push(data._id);
  post.save();
  res.redirect(`/posts/show/${id}`);
});
// posts routes -> all the posts which is created by the user
Router.get("/mydiscussion", async (req, res) => {
  if (!req.user) {
    req.flash("error", "you are not logged in");
    res.redirect("/login");
  } else {
    let { _id } = req.user;
    let userPost = await Post.find({ createdBy: { $in: _id } }).populate(
      "createdBy"
    );
    res.render("./posts/mydiscussion.ejs", { userPost });
  }
});

// show routes -> to show the specific posts in details
Router.get("/show/:id",isLogged, async (req, res) => {
  function formatRelativeTime(originalTimestamp) {
    const currentTimestamp = new Date();
    const timeDifference = currentTimestamp - originalTimestamp;

    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
      return "asked less than a minute ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `asked ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    // If the post is older than a week, return the actual date and time
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return originalTimestamp.toLocaleDateString(undefined, options);
  }
  let { id } = req.params;
  
  const data = await Post.findById(id)
    .populate("createdBy")
    .populate({
      path: "response", // Populate 'response' field
      model: "Response", // Model to reference
      populate: {
        path: "responsedBy", // Populate 'responsedBy' field within 'response'
        model: "User", // Model to reference
      },
    });
  if (! data.views.includes(req.user.id)) {
    data.views.push(req.user.id);
    data.save();
  }
  res.render("./posts/show.ejs", { data, formatRelativeTime });
});

// create route -> to serve the form
Router.get("/new", isLogged, (req, res) => {
  res.render("./posts/create.ejs");
});

// create route -> data receive route
Router.post("/new", async (req, res) => {
  let user = await User.findById(req.user);
  console.log(user);
  let { username, club, title, content } = req.body.posts;
  let newPost = new Post({
    title: title,
    content: content,
    club: club,
    createdBy: user,
  });
  await newPost.save();
  req.flash("success", "discussion created successfully 🎉");
  res.redirect(`/posts`);
});
// to update the status of the post

Router.put("/show/:id/res/:resId", async (req, res) => {
  
  let { id, resId } = req.params;                                                     
  await Post.findByIdAndUpdate(id, { status: "Resolved",bestRes:resId });
  res.redirect(`/posts/show/${id}`)
})
// logout route -> to terminate the user from the session
Router.get("/logout", (req, res) => {
  req.logout((err) => {
    console.log("logged out");
  });
  req.flash("success", "see you again!");
  res.redirect("/posts");
});

// delete route for post
Router.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  let deletedData = await Post.findByIdAndDelete(req.params.id);
  req.flash("success", "deleted successfully ⭐");
  res.redirect("/posts/mydiscussion");
});

// edit routes for the post

Router.post("/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await Post.findById(id);
  res.render("./posts/edit.ejs", { data });
});

Router.patch("/:id", async (req, res) => {
  console.log(req.params.id);
  console.log({ ...req.body.posts });
  await Post.findByIdAndUpdate(req.params.id, { ...req.body.posts });
  req.flash("success", "Update successfully 🎉");
  res.redirect("/posts/mydiscussion");
});
module.exports = Router;
