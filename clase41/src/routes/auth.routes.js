const express = require('express');
const router = express.Router();
const passport = require('../app/auth/passport');
const config = require('../config/config');
const transporter = require('../app/email/ethereal');
const { loggerError, loggerInfo } = require('../config/log4js');

//--------------------------------------------- LOGIN----------------------------------------------------------
router.get('/login', (req, res) => {
    try {
        res.render('auth/login');
    } catch (error) {
        loggerError.error(error)
    }
});

router.post('/login', passport.authenticate('login', { successRedirect: '/', failureRedirect: '/faillogin' }));

//----------------------------------Facebook Login----------------------------
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/',
        failureRedirect: '/faillogin'
    }
));

router.get('/faillogin', (req, res) => {
    try {
        res.status(400).render('auth/failLogin');
    } catch (error) {
        loggerError.error(error)
    }
});


//----------------------------------------------- SIGNUP -------------------------------------------------------
router.get('/signup', (req, res) => {
    try {
        res.render('auth/signup');
    } catch (error) {
        loggerError.error(error)
    }
});

router.post('/signup', passport.authenticate('signup', { successRedirect: '/', failureRedirect: '/failsignup' }));

router.get('/failsignup', (req, res) => {
    try {
        res.status(400).render('auth/failSignup');
    } catch (error) {
        loggerError.error(error)
    }
});


//-----------------------------------------------------LOGOUT-----------------------------------------------------------
router.get('/logout', (req, res) => {
    try {
        const usuario = req.session.userAuth.username ?? '';
        req.logout();

        transporter.sendMail({
            from: 'App Node-express CoderHouse',
            to: config.MAIL_TO,
            subject: `Logout Facebook - ${usuario}`,
            html: `<p>Usuario: ${usuario}</p><p>Fecha y hora: ${new Date().toLocaleString()}</p>`
        }, (err, info) => {
            if (err) {
                loggerError.error(err)
                return err
            }
            loggerInfo.info(info);
        })

        res.render('auth/logout', { username: usuario });
    } catch (error) {
        loggerError.error(error)
    }
});

module.exports = router;