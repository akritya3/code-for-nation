const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const { query } = require("../db");


/**
 * 
 * @param  req 
 * @param  res
 * GET /woman/login 
 */

const getLogin = (req, res) => {
  res.render("womanlogin");
};

/**
 * 
 * @param  req 
 * @param  res
 * POST /woman/login 
 */

const postLogin = async (req, res, next) => {
  await check("password").isLength({min:1}).run(req);
  await check("phonenumber").isMobilePhone("en-IN").run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("login",{err:"invalid details kindly check phone number"});
    return;
  }
  console.log(req.body);
  passport.authenticate("local.woman", {
    failureRedirect: "/woman/login",
    successRedirect: "/woman/dashboard",
    failureFlash: true
  })(req, res, next);
};

/**
 * 
 * @param  req 
 * @param  res
 * GET /woman/signup 
*/
const getSignup = (req,res) => {
  res.render("womansignup");
}


/**
 * 
 * @param  req 
 * @param  res
 * POST /woman/signup 
 */
const postSignup = async (req,res) => {
  await check("phonenumber").isMobilePhone("en-IN").run(req);
  await check("name").notEmpty().run(req);
  await check("password").isLength({min:1}).run(req);
  await check("confirmPassword").equals(req.body.password).run(req);
  await check("age").isInt({gt:12}).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.statusCode = 422;
    console.log(errors);
    let err = "";
    errors.array().forEach(element => {
      if(element.param === "confirmPassword") {
        err += "Password do not matches";
      }
      else {
        err += "Invalid " + element.param + ".";
      }      
    });
    res.render("womansignup",{err:`${err}`});
    return;
  }

  const {phonenumber,name,password,age} = req.body;
  query("SELECT phonenumber FROM woman WHERE  phonenumber=$1",[phonenumber])
    .then(function(result) {
      const data = result.rows.length;
      if(data !== 0) {
        res.render("womansignup",{err:"user already exist try to login"});
        return;
      }
      bcrypt.genSalt(16)
        .then(function(salt) {
          bcrypt.hash(password,salt)
            .then(function(hash) {
              query("INSERT INTO woman(phonenumber, name, password, age) VALUES($1,$2,$3,$4)",[phonenumber,name,hash,age])
                .then(function() {
                  req.flash("success_message", "Registered successfully... Login to continue..");
                  res.redirect("/woman/login");
                })
                .catch(function(err) {
                  console.log(err);
                  res.render("womansignup",{err:"internal server error"});
                })
            })
            .catch(function(err) {
              console.log(err);
              res.render("womansignup",{err:"internal server error"});
            });
        })
        .catch(function(err) {
          console.log(err);
          res.render("womansignup",{err:"internal server error"});
        });
    })
    .catch(function(err){
      console.log(err);
      res.render("womansignup",{err:"internal server error"});
    });
};
/**
 * GET /woman/logout 
 */
const getLogout = (req, res) => {
  req.logOut();
  res.redirect("/");
}
/**
 * GET /woman/dashboard 
 */
const getWomanDashboard = (req, res) => {
  res.redirect("/womandashboard.html");
}


module.exports = {
  getLogin : getLogin,
  postLogin: postLogin,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogout: getLogout,
  getWomanDashboard: getWomanDashboard
};