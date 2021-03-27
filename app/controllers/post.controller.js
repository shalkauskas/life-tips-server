const db = require("../models");
const Post = db.posts;
const User = db.users;
const admin = process.env.ADMIN_ID;
// Pagintaion
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
// Create and Save a new Post // passport
exports.create = (req, res) => {
  // validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Title can not be empty!" });
    return;
  }
  // create a Post
  const currentTime = new Date().toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const post = new Post({
    content: req.body.content,
    title: req.body.title,
    published: req.body.published ? req.body.published : false,
    author: req.body.author ? req.body.author : "Anonymous",
    userId: req.body.userId ? req.body.userId : "0",
    rating: req.body.rating ? req.body.rating : "0",
    time: req.body.time ? req.body.time : currentTime,
  });
  // save Post in the database
  post
    .save(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Post.",
      });
    });
};

// Retrieve all published Posts //
exports.findAllPublished = (req, res) => {
  const { title, page, size, order } = req.query;
  var sortOrder =
    order === "new"
      ? { time: -1 }
      : order === "best"
      ? { rating: -1 }
      : { id: 1 };
  var condition = title
    ? {
        published: true,
        $text: { $search: title },
      }
    : { published: true };
  const { limit, offset } = getPagination(page, size);
  Post.paginate(condition, { offset, limit, sort: sortOrder })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        posts: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        order: order,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

// Retrieve all User published Posts // passport
exports.findAll = (req, res) => {
  const { title, page, size, order } = req.query;
  var sortOrder =
    order === "new"
      ? { time: -1 }
      : order === "best"
      ? { rating: -1 }
      : { id: 1 };
  const { limit, offset } = getPagination(page, size);
  User.findById(req.user.id, function (err, foundUsers) {
    if (req.user.id === admin) {
      Post.paginate({}, { offset, limit, sort: sortOrder })
        .then((data) => {
          res.send({
            totalItems: data.totalDocs,
            posts: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            order: order,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Posts.",
          });
        });
    } else if (foundUsers) {
      Post.paginate({ userId: req.user.id }, { offset, limit, sort: sortOrder })
        .then((data) => {
          res.send({
            totalItems: data.totalDocs,
            posts: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            order: order,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Posts.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Find a single Post with an id //
exports.findOne = (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Post with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Post with id=" + id });
    });
};
// Find a single Post with an id for update //
exports.findOneForUpdate = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Post.findById(id)
        .then((data) => {
          if (!data)
            res.status(404).send({ message: "Not found Post with id " + id });
          else res.send(data);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error retrieving Post with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Update a Post by the id in the request // commented out: rating only for authorized users
exports.update = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).json({ message: "Title can not be empty!" });
  } else {
    // User.findById(req.user.id, function (err, foundUsers) {
    //   if (foundUsers) {
    const id = req.params.id;
    Post.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
      new: true,
    })
      .then((data) => {
        if (!data)
          res.status(404).send({
            message: `Cannot update Post with id=${id}. Maybe Post was not found!`,
          });
        else res.send(data);
      })
      .catch((err) => {
        res.status(500).send({ message: "Error updating Post with id=" + id });
      });
    // } else {
    //   res.status(403).send("Not authenticated");
    // }
    // });
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
        Post.updateMany(
          { published: false },
          { $set: { published: true } },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data)
              res.status(404).send({
                message: `Cannot update Posts. Maybe Post was not found! Ha-ha!`,
              });
            else res.send(data);
          })
          .catch((err) => {
            res.status(500).send({ message: "Error updating Posts" });
          });
      } else {
        res.status(403).send("Not authenticated");
      }
    });
  }
};

// Delete a Post with the specified id in the request //
exports.delete = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      const id = req.params.id;
      Post.findByIdAndRemove(id)
        .then((data) => {
          if (!data)
            res.status(404).send({
              message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
            });
          else
            res.send({
              message: "Post was deleted successfully!",
            });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Could not delete Post with id=" + id });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};

// Delete all Posts added by user //
exports.deleteAll = (req, res) => {
  User.findById(req.user.id, function (err, foundUsers) {
    if (foundUsers) {
      Post.deleteMany({ userId: req.user.id })
        .then((data) => {
          res.send({
            message: `${data.deletedCount} Posts were deleted successfully!`,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Posts.",
          });
        });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
};
