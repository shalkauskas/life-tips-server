module.exports = (app) => {
  const passport = require("passport");
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // index
  router.get("/", users.index);
  // login
  router.post("/login", users.login);
  // admin
  router.get("/admin", users.admin);
  // update name
  router.post("/dashboard", users.updateName);
  // update photo
  router.post("/dashboard/profile", users.updatePhoto);
  // register
  router.post("/register", users.register);
  // logout
  router.get("/logout", users.logout);
  // google
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/auth/google/secrets",
    passport.authenticate("google", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      res.redirect(process.env.CORS_ORIGIN);
    }
  );

  app.use("/api", router);
};
