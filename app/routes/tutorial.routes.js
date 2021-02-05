module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAllPublished);
  // Retrieve all User published Tutorials
  router.get("/:uid/update", tutorials.findAll);

  // Retrieve all published Tutorials
  // router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Retrieve a single Tutorial with id for update
  router.get("/:uid/update/:id", tutorials.findOneForUpdate);

  // Update a Tutorial with id
  router.put("/:uid/update/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:uid/update/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/:uid/update", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
