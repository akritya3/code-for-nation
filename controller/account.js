/**
 * 
 * @param  req 
 * @param  res
 * GET /account 
 */
const getAccount = (req,res) => {
  res.send(req.session.passport.user);
}

module.exports = {
  getAccount: getAccount
};