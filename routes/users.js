var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  console.log("testing :");
  console.log("RAW CLAIMS:", req.user._json);
  res.render('user', {
    userProfile: JSON.stringify(userProfile, null, 2),
	claims: JSON.stringify(req.user._json, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;
