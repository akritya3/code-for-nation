const path = require('path');
const { query } = require("../db");
const { check, validationResult } = require("express-validator");

/** 
 * GET /searchjobs
 * returns the findpage.html, which contains a form to search jobs on the basis of 
 * skill, title or location.
*/
const getSearchJobs = (req, res) => {
  res.render("searchjob");
};

/**
 * GET /addnewjob 
 */
const getAddNewJob = (req, res) => {
  res.render("addnewjob");
};

/**
 * POST /addnewjob
 * add new jobs to the database, in table jobs.
 */
const postAddNewJob = async (req, res) => {
  await check("location").notEmpty().run(req);
  await check("description").notEmpty().run(req);
  await check("phonenumber").isMobilePhone("en-IN").run(req);
  await check("title").notEmpty().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render("addnewjob",{err:"incomplete or wrong details"});
    return;
  }
  let {location, description, phonenumber, email, link, title} = req.body;
  const employerid = req.session.passport.user;
  if(email === "") email = null;
  if(link === "") link = null;
  query("INSERT INTO jobs(location, description, phonenumber, link, email, employerid, title) VALUES($1, $2,$3,$4,$5,$6,$7)",[location, description, phonenumber, link, email, employerid, title])
    .then(function(result){
      if(result.rowCount === 1) {
        res.redirect("/success.html");
        return;
      } 
      else {
        res.render("addnewjob", {err:"job already exist"})
        return;
      }
    })
    .catch(function(err){
      console.log(err);
      res.render("addnewjob",{err:"internal server error"});
    });
};
/**
 * GET /deletejob
 */
const getDeleteJob = (req,res) => {
  res.render("deletejob");
};

const postDeleteJob = async (req,res) => {
  await check("title").notEmpty().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render("deletejob",{err:"incomplete or wrong job title"});
    return;
  }
  const employerid = req.session.passport.user;
  const {title} = req.body;

  query("DELETE FROM jobs WHERE employerid=$1 AND title=$2",[employerid, title])
    .then(function(result){
    if(result.rowCount === 1) {
        res.redirect("/success.html");
        return;
      } 
      else {
        res.render("deletejob", {err:"no such job exist"})
        return;
      }
    })
    .catch(function(err){
      console.log(err);
      res.render("delete",{err:"internal server error"});
    })
}

/**
 * POST /searchjobs
 * returns jobs on the basis of the skill and location. 
 */
const postSearchJobs = async (req, res) => {
  await check("title").notEmpty().run(req);
  await check("location").notEmpty().run(req);
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render("searchjob",{err:"incomplete or wrong details"});
    return;
  } 
  const {title,location} = req.body;
  query("SELECT * FROM jobs WHERE title=$1 AND location=$2",[title, location])
    .then(function(result) {
      const data = result.rows;
      res.render("searchjobresult",{data:data});
    })
    .catch(function(err){
      console.log(err);
      res.render("searchjob",{err:"internal server error"});
    }); 
};

module.exports = {
  getAddNewJob: getAddNewJob,
  postAddNewJob: postAddNewJob,
  getDeleteJob: getDeleteJob,
  postDeleteJob: postDeleteJob,
  postSearchJobs: postSearchJobs,
  getSearchJobs: getSearchJobs
};