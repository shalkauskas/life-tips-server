const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const findOrCreate = require("mongoose-findorcreate");
const db = require("./app/models");
const User = db.users;
var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`trust proxy`);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    proxy: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    cookie: {
      maxAge: 3600000, // one hour in millis
    },
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// passport
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
// strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          displayName: profile.displayName,
          photoUrl: profile.photos[0].value,
          username: profile.emails[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
// routes
app.get("/", (req, res) => {
  res.json({ message: "Dad's jokes API" });
});

// connect to db
db.mongoose.set("useCreateIndex", true);
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// set port, listen for requests
require("./app/routes/joke.routes")(app);
require("./app/routes/auth.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
