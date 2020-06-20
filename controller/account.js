const { query } = require("../db");
/**
 * 
 * @param  req 
 * @param  res
 * GET /account 
 */
const getAccount = (req, res) => {
  query("select * from woman where phonenumber=$1", [req.session.passport.user])
    .then(function (result) {
      res.statusCode = 200;
      res.json(result.rows);
      res.end();
    })
    .catch(function (err) {
      console.log(err);
      res.statusCode = 500;
      res.send("internal server error");
    });
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


module.exports = {
  getAccount: getAccount,
  postAaadharUpdate: postAaadharUpdate
};