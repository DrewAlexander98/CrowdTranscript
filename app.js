const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require('compression')
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("flash");

require("dotenv").config();
require("./models");
require("./config/passport");

const transcript = require("./routes/transcript");
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");
const about = require("./routes/about");
const admin = require("./routes/admin");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(helmet());
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1800000 // 30 mins
      }
    })
  );
} else {
  app.use(
    session({
      secret: "secret",
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1800000 // 30 mins
      }
    })
  );
}

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/", transcript);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);
app.use("/about", about);
app.use("/admin", admin);

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.render("404", {
    title: "404, Page not found"
  });
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
