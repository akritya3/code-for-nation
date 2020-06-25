const path = require('path');
const { query } = require("../db");
const { check, validationResult } = require("express-validator");

/** 
 * GET /findjob.html
 * returns the findpage.html, which contains a form to search jobs on the basis of 
 * skill, title or location.
*/
const getFindJobPage = (req, res) => {
  res.redirect("/findjob.html");
};


/**
 * POST /addjob
 * add new jobs to the database, in table jobs.
 */
const postAddJob = (req, res) => {

};

/**
 * GET /getjobs
 * returns jobs on the basis of the skill and location. 
 */
const getJobs = (req, res) => {

};
