var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');


router.use((req, res, next) => {
  console.log('[authRouter hit]', req.method, req.originalUrl);
  next();
});


//dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile',
  //authorizationParams: {
    //  redirect_uri: process.env.AUTH0_CALLBACK_URL
  //}
}), function (req, res) {
  res.redirect('/');
});

//ldap login
router.get('/login/staff', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'ACS-LDAP',
}), function (req, res) {
  res.redirect('/');
});

// Perform the aact organization login, after login Auth0 will redirect to callback


router.get('/login/aact', (req, res, next) => {
  const strategy = passport._strategy('auth0');

  // ✅ inject org into strategy instance
  strategy._org = 'org_SnjMrQuhJEuRO4cV';

  passport.authenticate('auth0', {
    scope: 'openid email profile'
  })(req, res, next);
});



/*router.get('/login/aact',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
    authorizationParams: {
      organization: 'org_SnjMrQuhJEuRO4cV'
    }
  }),
  function (req, res) {
    res.redirect('/');
  }
);
*/

router.get('/login/xchem-federate/', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'xchem-federate',
}), function (req, res) {
  res.redirect('/');
});

router.get('/login/benjamin-moore-paints-federate/', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'benjamin-moore-paints-federate',
}), function (req, res) {
  res.redirect('/');
});

router.get('/login/milliken-and-federate/', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'milliken-and-federate',
}), function (req, res) {
  res.redirect('/');
});

// Institutional Login (Cirrus)
router.get('/login/institution/', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'cirrus',
  prompt:'login',
}), function (req, res) {
  res.redirect('/');
});

// Bilateral Login (ACSFederate)
router.get('/login/acsfederate/', passport.authenticate('auth0', {
  scope: 'openid email profile',
  connection:'ACSFederate',
  prompt: 'login',
}), function (req, res) {
  res.redirect('/');
});

// Bilateral Login (x-chem)

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
/*router.get('/logout', (req, res) => {
  req.logout();
	if (err) { return next(err); }
  //var returnTo = req.protocol + '://' + req.get('host');
  var returnTo = `${req.protocol}://${req.get('host')}`;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  var logoutURL = new url.URL(
    //util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
	util.format('http://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});
*/
router.get('/logout', (req, res, next) => {
  // 1. Log out of the local session (requires a callback in Passport 0.6.0+)
  req.logout((err) => {
    if (err) { return next(err); }
  //req.logout();
	//if (err) { return next(err); }
	
    // 2. Clear the local session cookie
   // req.session.destroy((err) => {
    //  if (err) { return next(err); }

      // 3. Redirect to Auth0's logout endpoint to clear the SSO session
      //const returnTo = encodeURIComponent('http://localhost:3000/');
	    //var returnTo = `${req.protocol}://${req.get('host')}`;
		var returnTo = process.env.APP_BASE_URL;
		console.log('Logout route triggered,', returnTo);
  //const port = req.connection.localPort;
  //console.log('Logout port,', port);
 // if (port !== undefined && port !== 80 && port !== 443 && port!= 3000) {
   // returnTo += ':' + port;
  //}
	  console.log('Logout return to ', returnTo);
      const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
      
      res.redirect(logoutURL);
	  });
});

module.exports = router;
