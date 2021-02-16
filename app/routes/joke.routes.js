module.exports = (app) => {
  const jokes = require("../controllers/joke.controller.js");

  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/joke", jokes.create);

  // Retrieve all published Jokes
  router.get("/explore", jokes.findAllPublished);
  // Retrieve all User published jokes
  router.get("/joke/update", jokes.findAll);

  // Retrieve a single Tutorial with id
  router.get("/joke/:id", jokes.findOne);

  // Retrieve a single Tutorial with id for update
  router.get("/joke/update/:id", jokes.findOneForUpdate);

  // Update a Tutorial with id
  router.put("/joke/update/:id", jokes.update);

  // Delete a Tutorial with id
  router.delete("/joke/update/:id", jokes.delete);

  // Delete all Jokes
  router.delete("/joke/update", jokes.deleteAll);

  app.use("/api", router);
};
