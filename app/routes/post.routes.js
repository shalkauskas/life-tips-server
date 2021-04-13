module.exports = (app) => {
  const posts = require("../controllers/post.controller.js");

  var router = require("express").Router();
  // Create a new Post
  router.post("/post", posts.create);
  // Add comment
  router.post("/post/:id", posts.addComment);
  // Retrieve all published Posts
  router.get("/explore", posts.findAllPublished);
  // Retrieve all User published posts
  router.get("/post/update", posts.findAll);

  // Retrieve a single Post with id
  router.get("/post/:id", posts.findOne);
  // Get comments
  router.get("post/:id/comments", posts.getComments);
  // Retrieve a single Post with id for update
  router.get("/post/update/:id", posts.findOneForUpdate);

  // Update a Post with id
  router.put("/post/update/:id", posts.update);
  // Update/Publish all posts
  router.put("/post/update/", posts.updateMany);
  // Delete a Post with id
  router.delete("/post/update/:id", posts.delete);

  // Delete all Posts
  router.delete("/post/update", posts.deleteAll);

  app.use("/api", router);
};
