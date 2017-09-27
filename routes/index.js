var express = require('express');
var passport=require('../config/passport');
var app_controller=require('../controllers/appController');

var router = express.Router();

// Initialize Passport and restore authentication state, if any, from the
// session
router.use(passport.initialize());
router.use(passport.session());

/*Authentication */
router.get('/auth/twitter',passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { display:'popup',failureRedirect: '/' }),app_controller.get_liste);
router.get('/logout',function(req,res){
req.logout();
res.redirect('/');
});


/* GET home page. */
router.get('/',app_controller.get_started);
/* Display search results */
router.post('/',app_controller.get_liste);
/*update the going to count per restaurant */
router.post('/updatecount', app_controller.set_count);

module.exports=router;


