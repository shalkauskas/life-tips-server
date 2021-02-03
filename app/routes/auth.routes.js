module.exports = function (app) {
  const googleAuth = require("../controllers/googleAuth.js");
  //   listens to any route to give a token
  app.use(function (req, res) {
    let token = req.headers["x-access-token"];
    googleAuth(token);
    const getResult = async () => {
      const result = await googleAuth(token);
      //  user data fetched after token validation
      res.send(result);
      //  console.log(result);
      return result;
    };
    getResult();
  });
};
