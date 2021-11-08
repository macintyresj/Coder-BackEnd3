const express = require('express');
const router = express.Router();
const passport = require('../app/auth/passport');
const config = require('../config/config');
const transporter = require('../app/email/ethereal');

//--------------------------LOGIN----------------------------------------------------------------
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('login', { successRedirect: '/', failureRedirect: '/faillogin' }));

//------------------------Facebook Login--------------------------------------
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/',
        failureRedirect: '/faillogin'
    }
));


router.get('/faillogin', (req, res) => {
    res.status(400).render('auth/failLogin');
});


//------------------------SIGNUP----------------------------------------------------
router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('signup', { successRedirect: '/', failureRedirect: '/failsignup' }));

router.get('/failsignup', (req, res) => {
    res.status(400).render('auth/failSignup');
});


//------------------------LOGOUT-------------------------------------------------------------------
router.get('/logout', (req, res) => {
    try {
        const usuario = req.session.userAuth.username ?? '';
        req.logout();

        transporter.sendMail({
            from: 'App CoderHouse',
            to: config.MAIL_TO,
            subject: `Logout - ${usuario}`,
            html: `<p>Usuario: ${usuario}</p><p>Fecha y hora: ${new Date().toLocaleString()}</p>`
        }, (err, info) => {
            if (err) {
                console.log(err)
                return err
            }
            console.log(info);
        })

        res.render('auth/logout', { username: usuario });
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;