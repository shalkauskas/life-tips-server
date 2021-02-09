module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();
  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all published Tutorials
  router.get("/", tutorials.findAllPublished);
  // Retrieve all User published Tutorials
  router.get("/update", tutorials.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Retrieve a single Tutorial with id for update
  router.get("/update/:id", tutorials.findOneForUpdate);

  // Update a Tutorial with id
  router.put("/update/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/update/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/update", tutorials.deleteAll);

  app.use("/api/tutorials", router);
};
