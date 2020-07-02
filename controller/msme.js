const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const { query } = require("../db");

/**
 * GET /msme/signup 
 */
const getMsmeSignup = (req, res) => {
  res.render("msmesignup");
};

/**
 * POST /msme/signup 
 */
const postMsmeSignup = async (req,res) => {
  await check("msme_name").notEmpty().run(req);
  await check("msme_uam").isLength({min:12, max:12}).run(req);
  await check("msme_owner").notEmpty().run(req);
  await check("msme_phonenumber").isMobilePhone("en-IN").run(req);
  await check("msme_address").notEmpty().run(req);
  await check("msme_email").isEmail().run(req);
  await check("msme_type").notEmpty().run(req);
  await check("msme_password").notEmpty().run(req);
  await check("msme_confirmPassword").equals(req.body.msme_password).run(req);
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.statusCode = 422;
    console.log(errors);
    req.flash("error", "Invalid request kindly check all the details");
    res.redirect("/msme/signup");
    return;
  }

  const {msme_name, msme_uam, msme_owner, msme_phonenumber, msme_address, msme_email, msme_type, msme_password} = req.body;
  let {msme_website}  = req.body;
  if (msme_website === "") msme_website = null;
  console.log("hello sir");
  query("SELECT msme_phonenumber FROM msmes WHERE msme_phonenumber=$1",[msme_phonenumber])
    .then(function(result) {
      const data = result.rows;
      if(data.length > 0) {
        req.flash("error", "msme already registered kindly login to continue..");
        res.redirect("/msme/signup");
        return;
      }
      bcrypt.genSalt(7)
        .then(function(salt) {
          bcrypt.hash(msme_password, salt)
           .then(function(hash){
              console.log(hash);
              query("INSERT INTO msmes(msme_name, msme_owner, msme_uam, msme_address, msme_phonenumber, msme_email, msme_website, msme_type, msme_password) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[msme_name, msme_owner, msme_uam, msme_address, msme_phonenumber, msme_email, msme_website, msme_type, hash])
                .then(function() {
                  console.log("inserted into database");
                  req.flash("success_message","successful signup login to continue");
                  res.redirect("/msme/login");
                })
                .catch(function(err) {
                  console.log(err);
                  res.statusCode = 500;
                  req.flash("error", "internal server errror");
                  res.redirect("/msme/signup");
                })
           })
        })
        .catch(function(err) {
          console.log(err);
          res.statusCode = 500;
          req.flash("error", "internal server errror");
          res.redirect("/msme/signup");
        })
    })
    .catch(function(err) {
      console.log(err);
      res.statusCode = 500;
      req.flash("error", "internal server errror");
      res.redirect("/msme/signup");
    })
};


/**
 * GET /msme/login 
 */
const getMsmeLogin = (req,res) => {

};

/**
 * POST /msme/login 
 */
const postMsmeLogin = (req,res) => {

};

/**
 * GET /msme/dashboard
 * 
 */
const getDashboard = (req,res) => {

};
/**
 * GET /msme/addjob  
 */
const getAddJob = (req,res) => {

};

/**
 *  POST /msme/addjob
 */
const postAddJob = (req,res) => {

};
/**
 * GET /msme/promote 
 */
const getPromote = (req, res) => {

};
/**
 * POST /msme/promote 
 */
const postPromote = (req, res) => {

};

module.exports = {
  getMsmeLogin: getMsmeLogin,
  postMsmeLogin: postMsmeLogin,
  getMsmeSignup: getMsmeSignup,
  postMsmeSignup: postMsmeSignup,
  getDashboard: getDashboard,
  getAddJob: getAddJob,
  postAddJob: postAddJob,
  getPromote: getPromote,
  postPromote: postPromote
};
