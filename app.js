//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://olena:1234@cluster0.h0n8umz.mongodb.net/Blog", {
  useNewUrlParser: true,
});

// Schema for creating a blog entry
const blogsSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Blog = mongoose.model("Blog", blogsSchema);

const app = express();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Get all blogs
app.get("/", function (req, res) {
  Blog.find({}).then(function (storedBlogs) {
    res.render("home", { home: homeStartingContent, posts: storedBlogs });
  });
});

// Compose a blog entry
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.entryTitle,
    body: req.body.entryBody,
    id: new Date(),
  };

  const blog = new Blog(post);

  Blog.insertMany([blog]);
  res.redirect("/");
});

app.get("/posts/:post", function (req, res) {
  const parameter = _.lowerCase(req.params.post);

  Blog.find({}).then(function (foundBlogs) {
    foundBlogs.forEach(function (post) {
      const postTitle = _.lowerCase(post.title);
      if (postTitle === parameter) {
        res.render("post", {
          postTitle: postTitle,
          postBody: post.body,
          id: post.id,
        });
      }
    });
  });
});

// Update a blog entry
app.get("/posts/:post/update", function (req, res) {
  const parameter = _.lowerCase(req.params.post);

  Blog.find({}).then(function (foundBlogs) {
    foundBlogs.forEach(function (post) {
      const postTitle = _.lowerCase(post.title);
      if (postTitle === parameter) {
        res.render("update", {
          postTitle: postTitle,
          postBody: post.body,
          id: post.id,
        });
      }
    });
  });
});

app.post("/posts/:post/update", async function (req, res) {
  const parameter = _.lowerCase(req.params.post);
  
  Blog.findOneAndUpdate({title: parameter},  {
    title: req.body.entryTitle,
    body: req.body.entryBody,
  }).then(console.log("Updated!"));
  res.redirect("/");
});


// Delete a blog
app.post("/posts/:post/delete", function (req, res) {
  const parameter = _.lowerCase(req.params.post);
  Blog.findOneAndDelete({title: parameter}).then(console.log("Deleted!"));
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
