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
const postSignupEmployer = (req,res) => {
  
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
