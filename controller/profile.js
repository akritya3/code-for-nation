const path = require('path');
const { query } = require("../db");
const { check, validationResult } = require("express-validator");

/**
 * 
 * @param  req 
 * @param  res
 * GET /profile 
 */
const getProfile = (req, res) => {
  query("SELECT * FROM woman WHERE phonenumber=$1",[req.session.passport.user])
  .then(function(result) {
    const data = result.rows[0];
    res.render("profile",{data:data});
  })
  .catch(function(err){
    console.log(err);
  });
}

/**
 * 
 * @param  req 
 * @param req.body = {email, maritalstatus, isemployeed, highesteducation, isbankaccount };
 * @param  res 
 * POST /updateprofile
 * 
 */
const postUpdateProfile = async (req, res) => {
  const phonenumber = req.session.passport.user;
  let { email, maritalstatus, isemployeed, highesteducation, isbankaccount } = req.body;
  let errors = null;
  if(email !== undefined) {
    await check("email").isEmail().run(req);
    errors = validationResult(req);
    if(!errors.isEmpty) {
      res.statusCode = 400;
      res.end();
      //res.render("account",{err:"invalid email"});
      return;
    }
  }
  if( maritalstatus === undefined) {
    maritalstatus = null;
  }
  if(isemployeed === undefined) {
    isemployeed = null;
  }
  if(highesteducation === undefined) {
    highesteducation = null;
  }
  if(isbankaccount === undefined) {
    isbankaccount = false;
  }
  query("UPDATE woman SET email=$1, maritalstatus=$2, isemployeed=$3, highesteducation=$4, isbankaccount=$5 WHERE phonenumber=$6",[email,maritalstatus,isemployeed,highesteducation,isbankaccount,phonenumber])
    .then(function(result) {
      res.redirect("/profile");
      res.statusCode = 200;
      res.end();
    })
    .catch(function(err){
      console.log(err);
      res.statusCode = 500;
      res.end();
    })

}

const postAaadharUpdate = (req, res) => {
  const phonenumber = req.session.passport.user;
  const { isaadhar, aadhar } = req.body;

  if (isaadhar === undefined || aadhar === undefined) {
    res.statusCode = 400;
    res.end();
    return;
  }
  if (isaadhar) {
    // consider we have verified it;
    query("UPDATE woman SET isaadhar=$1,aadhar=$2 WHERE phonenumber=$3", [true, aadhar, phonenumber])
      .then(function (result) {
        res.redirect('/profile');
      })
      .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.end();
      });
  }
  else {
    res.sendFile(path.join(__dirname + "././test.pdf"));
  }
}


const postPanUpdate = (req, res) => {
  const phonenumber = req.session.passport.user;
  const { ispan, pan } = req.body;

  if (ispan === undefined || pan === undefined) {
    res.statusCode = 400;
    res.end();
    return;
  }
  if (ispan) {
    // consider we have verified the pan. We will get the API after govt pass it;
    query("UPDATE woman SET ispan=$1,pan=$2 WHERE phonenumber=$3", [true, pan, phonenumber])
      .then(function (result) {
        res.statusCode = 200;
        res.end();
      })
      .catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.end();
      });
  }
  else {
    res.end();
  }
}

//  For Testing The Query In DATABASE
// function test(){
//   query("SELECT * FROM woman")
//     .then(function(result){
//       res.statusCode = 200;
//       res.json(result.rows);
//       res.end();
//     })
//     .catch(function(err){
//       console.log(err);
//       res.statusCode = 500;
//       res.send("internal server erorr")
//     });
// }

// test();

module.exports = {
  getProfile: getProfile,
  postAaadharUpdate: postAaadharUpdate,
  postUpdateProfile: postUpdateProfile
};