const brcypt = require("bcryptjs");
const passportLocal = require("passport-local");
const LocalStrategy = passportLocal.Strategy;
const { query } = require("../db");

const womanStrategy = new LocalStrategy(
  {
    usernameField: "phonenumber",
    passwordField: "password"
  },
  function (phonenumber, password, done) {
    console.log(phonenumber);
    console.log(password);
    query("SELECT phonenumber,password FROM woman WHERE phonenumber=$1", [phonenumber])
      .then(function (result) {
        const data = result.rows;

        if (data.length === 0) {
          done(null, false, { message: "User Doesn't Exist.Kindly signup" });
        }

        const hash = data[0].password;
        brcypt.compare(password, hash)
          .then(function (match) {
            return match ? done(null, data[0].phonenumber) : done(null, false, { message: "Invalid Password" });
          })
          .catch(function (err) {
            console.log(err);
            return done(null, false, { message: "Internal Server Error. Kindly try Again" });
          });
      })
      .catch(function (err) {
        console.log(err);
        return done(null, false, { message: "Internal Server Error. Kindly try Again" });
      });
  })

// const employerStrategy = new LocalStrategy();


const configStrategy = (passport) => {
  passport.use('local.woman',womanStrategy);
  // passport.use('local.employer',employerStrategy);
  
  // meaning storing a information in cookie to identify the user.
  passport.serializeUser(function (id, done) {
    done(null, id);
  });


  passport.deserializeUser(function (id, done) {
    done(null, id);
  });

};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.set("Cache-control", "no-cache, private, no-store, must-revalidate, post-check=0,pre-check=0");
    return next();
  } else {
    console.log("the request was not authenticated");
    res.redirect("/login");
  }
};

module.exports = {
  configStrategy: configStrategy,
  isAuthenticated: isAuthenticated
};