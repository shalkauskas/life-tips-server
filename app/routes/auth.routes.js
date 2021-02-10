module.exports = (app) => {
  const passport = require("passport");
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // index
  router.get("/", users.index);
  // login
  router.post("/login", users.login);
  // dashboard
  router.get("/dashboard", users.dashboard);
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
      // req.session.save(() => {
      //   if (req.isAuthenticated()) {
      //     res.status(200).json({ isAuthenticated: true });
      //   } else {
      //     res.status(500).json({ isAuthenticated: false });
      //   }
      // });
      res.redirect(process.env.CORS_ORIGIN);
    }
  );

  app.use("/api", router);
};
