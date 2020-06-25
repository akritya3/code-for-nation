const { check, validationResult } = require("express-validator");
const {query} = require("../db");
const bcrypt = require("bcryptjs");
/**
 * GET /employer/signup
 * returns the employer.html, which contains a form to add a new employer to the database 
 */
const getSignupEmployer = (req, res) => {
  res.render("employersignup");
};

/**
 * POST /employer/signup
 * add new employer to the table employer and also in notverifiedemployers table
 * return success.html page.
 */
const postSignupEmployer = async (req,res) => {
  
  await check("password").isLength({min:1}).run(req);
  await check("confirmPassword").equals(req.body.password).run(req);
  await check("phonenumber").isMobilePhone("en-IN").run(req);
  await check("companyname").notEmpty().run(req);
  await check("uam").isLength({min:12,max:12}).run(req);
  await check("location").notEmpty().run(req);
  await check("email").isEmail().run(req);
  await check("about").notEmpty().run(req);
  await check("owner").notEmpty().run(req);


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
    res.render("employersignup",{err:`${err}`});
    return;
  }

  const {companyname, uam, location, phonenumber, email, about, website, owner, password} = req.body;
  if(website === "") website = null;

  query("SELECT phonenumber FROM employer WHERE  phonenumber=$1",[phonenumber])
    .then(function(result) {
      const data = result.rows.length;
      if(data !== 0) {
        res.render("employersignup",{err:"user already exist try to login"});
        return;
      }
      bcrypt.genSalt(16)
        .then(function(salt) {
          bcrypt.hash(password,salt)
            .then(function(hash) {
              query("INSERT INTO employer(companyname, uam, location, phonenumber, email, about, website, owner, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",[companyname,uam,location, phonenumber, email, about, website, owner, hash ])
                .then(function() { 
                  query("INSERT INTO notverifiedemployers(employerid) VALUES($1)",[phonenumber])
                  .then(function(){
                    req.flash("success_message", "Registered successfully... Login to continue..");
                    res.redirect("/employer/login");
                  })
                  .catch(function(err) {
                    console.log(err);
                    res.render("employersignup",{err:"internal server error"});
                  });
                  
                })
                .catch(function(err) {
                  console.log(err);
                  res.render("employersignup",{err:"internal server error"});
                })
            })
            .catch(function(err) {
              console.log(err);
              res.render("employersignup",{err:"internal server error"});
            });
        })
        .catch(function(err) {
          console.log(err);
          res.render("employersignup",{err:"internal server error"});
        });
    })
    .catch(function(err){
      console.log(err);
      res.render("employersignup",{err:"internal server error"});
    });


};

/**
 * GET /employer/login 
 */
const getLoginEmployer = (req, res) => {

};

/**
 * POST /employer/login 
 */
const postLoginEmployer = (req,res) => {
  
};
/**
 * GET /employer/logout 
 */
const getEmployerLogout = (req, res) => {
  res.render("employer");
};

/**
 * GET /employer/dashboard 
 */
const getEmployerDashboard = (req, res) => {

};  

/**
 * GET /employer/verify 
 */
const getVerifyEmployer = (req, res) => {
  res.redirect("/verifyemployer.html");
};

/**
 * POST /verifyemployer 
 * verifies the employer, in development mode we will verify it manually from 
 * uamverfication.gov.in and if verified deletes row employer from the 
 * notverifiedemployer table send email to the email that they are verified 
 * now they can login and post their jobs in the portal.
 */
const postVerifyEmployer = (req, res) => {

};


module.exports = {
  getSignupEmployer: getSignupEmployer,
  postSignupEmployer: postSignupEmployer
};