const { Router } = require('express');
const router = Router();
const passport = require('../app/auth/passport');
const upload = require('../app/middlewares/multer');

//-----------LOGIN----------------
router.post('/login', passport.authenticate('login',
    {
        successRedirect: '/'
    }
));

//-----------REGISTRO----------------
router.post('/signup', upload.single('foto'), passport.authenticate('signup',
    {
        successRedirect: '/'
    }
));

//-----------LOGOUT----------------
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;