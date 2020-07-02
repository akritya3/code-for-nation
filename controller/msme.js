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

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.statusCode = 422;
    req.flash("error", "Invalid request kindly check all the details");
    res.redirect("/msme/signup");
  }

  const {msme_name, msme_uam, msme_owner, msme_phonenumber,}

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
