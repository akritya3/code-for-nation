const path = require('path');
const { query } = require("../db");
const { check, validationResult } = require("express-validator");

/**
 * 
 * @param  req 
 * @param  res
 * GET /woman/profile 
 */
const getProfile = (req, res) => {
  query("SELECT * FROM woman WHERE phonenumber=$1", [req.session.passport.user])
    .then(function (result) {
      const data = result.rows[0];
      res.render("womanprofile", { data: data });
    })
    .catch(function (err) {
      console.log(err);
    });
}

/**
 * 
 * @param  req 
 * @param req.body = {email:string, maritalstatus:checkbox, isemployeed:checkbox, highesteducation:string, isbankaccount:checkbox };
 * @param  res 
 * POST /woman/updateprofile
 * 
 */
const postUpdateProfile = async (req, res) => {
  const phonenumber = req.session.passport.user;
  let { email, maritalstatus, isemployeed, highesteducation, isbankaccount } = req.body;
  let errors = null;
  if (email !== undefined) {
    await check("email").isEmail().run(req);
    errors = validationResult(req);
    if (!errors.isEmpty) {
      res.statusCode = 400;
      res.end();
      return;
    }
  }
  if (maritalstatus === undefined) {
    maritalstatus = false;
  } else maritalstatus = true; 
  if (isemployeed === undefined) {
    isemployeed = false;
  } else isemployeed = true;
  if (highesteducation === "") {
    highesteducation = null;
  } 
  if (isbankaccount === undefined) {
    isbankaccount = false;
  } else isbankaccount = true;

  query("UPDATE woman SET email=$1, maritalstatus=$2, isemployeed=$3, highesteducation=$4, isbankaccount=$5 WHERE phonenumber=$6", [email, maritalstatus, isemployeed, highesteducation, isbankaccount, phonenumber])
    .then(function (result) {
      res.redirect("/profile");
      res.statusCode = 200;
      res.end();
    })
    .catch(function (err) {
      console.log(err);
      res.statusCode = 500;
      res.end();
    })

}
/**
 * 
 * @param {*} req 
 * @param {*} res
 * req.body = {isaadhar: checkbox, aadhar: string}
 * POST /woman/updateaadhar 
 */
const postAaadharUpdate = (req, res) => {
  const phonenumber = req.session.passport.user;
  const { isaadhar, aadhar } = req.body;
  console.log(isaadhar);
  console.log(aadhar);
  if (isaadhar === undefined && aadhar === "") {
    res.sendFile(path.join(__dirname + "/../test.pdf"));
    return;
  }
  if (aadhar.length !== 12) {
    res.statusCode = 400;
    res.end();
    return;
  }
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

/**
 * 
 * req.body = { ispan:checkbox, pan:string }
 * POST /woman/panupdate 
 */
const postPanUpdate = (req, res) => {
  const phonenumber = req.session.passport.user;
  const { ispan, pan } = req.body;
  console.log(ispan);
  console.log(pan);
  if (ispan === undefined && pan === "") {
    res.sendFile(path.join(__dirname + "/../test.pdf"));
    return;
  }
  // pan verification api ....
  if (aadhar.length !== 10) {
    res.statusCode = 400;
    res.end();
    return;
  }
  // consider we have verified it;
  query("UPDATE woman SET ispan=$1,pan=$2 WHERE phonenumber=$3", [true, pan, phonenumber])
    .then(function (result) {
      res.redirect('/profile');
    })
    .catch(function (err) {
      console.log(err);
      res.statusCode = 500;
      res.end();
    });
}





module.exports = {
  getProfile: getProfile,
  postAaadharUpdate: postAaadharUpdate,
  postUpdateProfile: postUpdateProfile,
  postPanUpdate: postPanUpdate
};