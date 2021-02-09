const db = require("../models");
const Tutorial = db.tutorials;
const User = db.users;
const admin = process.env.ADMIN_ID;
// Create and Save a new Tutorial // passport
exports.create = (req, res) => {
  // validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
    author: req.body.author ? req.body.author : "Anonymous",
    userId: req.body.userId ? req.body.userId : "0",
  });
  // save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all published Tutorials //
exports.findAllPublished = (req, res) => {
  const query = req.query.title;
  var condition = query
    ? {
        published: true,
        $text: { $search: query },
      }
    : { published: true };

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Retrieve all User published Tutorials // passport
exports.findAll = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      Tutorial.find({ userId: req.user.id })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Find a single Tutorial with an id (not used atm)//
exports.findOne = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Tutorial.findById(id)
        .then((data) => {
          if (!data)
            res
              .status(404)
              .send({ message: "Not found Tutorial with id " + id });
          else res.send(data);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error retrieving Tutorial with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};
// Find a single Tutorial with an id for update //
exports.findOneForUpdate = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Tutorial.findById(id)
        .then((data) => {
          if (!data)
            res
              .status(404)
              .send({ message: "Not found Tutorial with id " + id });
          else res.send(data);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error retrieving Tutorial with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Update a Tutorial by the id in the request //
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  } else {
    User.findById(req.user.id, function (err, foundUsers) {
      if (foundUsers) {
        const id = req.params.id;
        Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then((data) => {
            if (!data)
              res.status(404).send({
                message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
              });
            else res.send({ message: "Tutorial was updated successfully." });
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Error updating Tutorial with id=" + id });
          });
      } else {
        res.status(403).send("Not authenticated");
      }
    });
  }
};

// Delete a Tutorial with the specified id in the request //
exports.delete = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Tutorial.findByIdAndRemove(id)
        .then((data) => {
          if (!data)
            res.status(404).send({
              message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
            });
          else
            res.send({
              message: "Tutorial was deleted successfully!",
            });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Could not delete Tutorial with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Delete all Tutorials added by user //
exports.deleteAll = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      Tutorial.deleteMany({ userId: req.user.id })
        .then((data) => {
          res.send({
            message: `${data.deletedCount} Tutorials were deleted successfully!`,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while removing all tutorials.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};
