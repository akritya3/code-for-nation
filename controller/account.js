const { query } = require("../db");
const { check, validationResult } = require("express-validator");

/**
 * 
 * @param  req 
 * @param  res
 * GET /account 
 */
const getAccount = (req,res) => {
  query("select * from woman where phonenumber=$1",[req.session.passport.user])
    .then(function(result){
      res.statusCode = 200;
      res.json(result.rows);
      res.end();
    })
    .catch(function(err) {
      console.log(err);
      res.statusCode = 500;
      res.send("internal server erorr")
    });
}

const postUpdateProfile = (req,res) => {
  const phonenumber = req.session.passport.user;
  const {email, maritalstatus, isaadhar, aadhar, ispan, pan, israshan, rashan, isdomicile, domicile, isemployeed, highesteducation, isbankaccount } = req.body;
  
}

function test(){
  query("SELECT * FROM woman")
    .then(function(result){
      res.statusCode = 200;
      res.json(result.rows);
      res.end();
    })
    .catch(function(err){
      console.log(err);
      res.statusCode = 500;
      res.send("internal server erorr")
    });
}

test();
module.exports = {
  getAccount: getAccount
};