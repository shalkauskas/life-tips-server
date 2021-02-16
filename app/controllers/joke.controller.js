const db = require("../models");
const Joke = db.jokes;
const User = db.users;
const admin = process.env.ADMIN_ID;
// Create and Save a new Joke // passport
exports.create = (req, res) => {
  // validate request
  if (!req.body.content) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // create a Joke
  const currentTime = new Date().toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const joke = new Joke({
    content: req.body.content,
    published: req.body.published ? req.body.published : false,
    author: req.body.author ? req.body.author : "Anonymous",
    userId: req.body.userId ? req.body.userId : "0",
    rating: req.body.rating ? req.body.rating : "0",
    time: req.body.time ? req.body.time : currentTime,
  });
  // save Joke in the database
  joke
    .save(joke)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Joke.",
      });
    });
};

// Retrieve all published Jokes //
exports.findAllPublished = (req, res) => {
  const query = req.query.title;
  var condition = query
    ? {
        published: true,
        $text: { $search: query },
      }
    : { published: true };

  Joke.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving jokes.",
      });
    });
};

// Retrieve all User published Jokes // passport
exports.findAll = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (req.user.id === admin) {
      Joke.find({})
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Jokes.",
          });
        });
    } else if (foundUsers) {
      Joke.find({ userId: req.user.id })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Jokes.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Find a single Joke with an id //
exports.findOne = (req, res) => {
  const id = req.params.id;
  Joke.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Joke with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Joke with id=" + id });
    });
};
// Find a single Joke with an id for update //
exports.findOneForUpdate = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Joke.findById(id)
        .then((data) => {
          if (!data)
            res.status(404).send({ message: "Not found Joke with id " + id });
          else res.send(data);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error retrieving Joke with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Update a Joke by the id in the request //
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  } else {
    User.findById(req.user.id, function (err, foundUsers) {
      if (foundUsers) {
        const id = req.params.id;
        Joke.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then((data) => {
            if (!data)
              res.status(404).send({
                message: `Cannot update Joke with id=${id}. Maybe Joke was not found!`,
              });
            else res.send(data);
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Error updating Joke with id=" + id });
          });
      } else {
        res.status(403).send("Not authenticated");
      }
    });
  }
};
exports.updateMany = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  } else {
    User.findById(req.user.id, function (err, foundUsers) {
      if (foundUsers) {
        Joke.updateMany(
          { published: false },
          { $set: { published: true } },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data)
              res.status(404).send({
                message: `Cannot update Jokes. Maybe Joke was not found! Ha-ha!`,
              });
            else res.send(data);
          })
          .catch((err) => {
            res.status(500).send({ message: "Error updating Jokes" });
          });
      } else {
        res.status(403).send("Not authenticated");
      }
    });
  }
};

// Delete a Joke with the specified id in the request //
exports.delete = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Joke.findByIdAndRemove(id)
        .then((data) => {
          if (!data)
            res.status(404).send({
              message: `Cannot delete Joke with id=${id}. Maybe Joke was not found!`,
            });
          else
            res.send({
              message: "Joke was deleted successfully!",
            });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Could not delete Joke with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Delete all Jokes added by user //
exports.deleteAll = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      Joke.deleteMany({ userId: req.user.id })
        .then((data) => {
          res.send({
            message: `${data.deletedCount} Jokes were deleted successfully!`,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Jokes.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};
