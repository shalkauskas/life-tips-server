const passport = require("passport");
const db = require("../models");
const User = db.users;
const session = require("express-session");
module.exports = (app) => {
  var router = require("express").Router();
  app.use(passport.session());
  passport.use(User.createStrategy());
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  app.use(
    session({
      secret: "12345667",
      resave: false,
      cookie: {
        maxAge: 360000, // one hour in millis
      },
      saveUninitialized: false,
    })
  );
  // register
  router.get("/", function (req, res) {
    if (req.isAuthenticated()) {
      User.findById(req.user.id, function (err, foundUser) {
        if (err) {
          console.log(err);
        } else {
          if (foundUser) {
            // console.log(foundUser);
            res.json({ isAuthenticated: true, user: foundUser });
          }
        }
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  router.get("/dashboard", function (req, res) {
    if (req.isAuthenticated()) {
      User.findById(req.user.id, function (err, foundUser) {
        if (err) {
          console.log(err);
        } else {
          if (foundUser) {
            // console.log(foundUser);
            res.json({ isAuthenticated: true, user: foundUser });
          }
        }
      });
    } else {
      res.status(403).send("Not authenticated");
    }
  });
  router.post("/register", function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            return res.status(200).json({ success: true, data: user });
          });
        }
      }
    );
  });
  // google
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );
  router.get(
    "/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect to secrets.
      res.redirect("/secrets");
    }
  );

  // login
  router.post("/login", function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          req.session.save(() => {
            if (req.isAuthenticated()) {
              res.status(200).json({ isAuthenticated: true });
            } else {
              res.status(500).json({ isAuthenticated: false });
            }
          });
        });
      }
    });
  });
  // logout
  router.get("/logout", function (req, res) {
    req.logout();
    res.json({ success: true });
  });

  app.use("/api", router);
};
