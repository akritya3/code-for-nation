const path = require('path');
const { query } = require("../db");
const { check, validationResult } = require("express-validator");


const getFindJobPage = (req, res) => {
  res.render("findjob");
}

const postFindJob = (req, res) => {
}