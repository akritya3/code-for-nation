const { query } = require("../db");
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
      res.send("internal server error");
    });
}

module.exports = {
  getAccount: getAccount
};