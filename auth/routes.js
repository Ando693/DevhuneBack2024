const router = require("express").Router();
const passport = require("passport");
const multer = require("multer")
const md5 = require("md5");
const storage = require('../config/multer');
const fs = require('fs');
const nodemailer = require('../config/nodemailer');

require("dotenv").config();
const CLIENT_URL = process.env.CLIENT_URL;
const { User, User0 } = require("../models");

const upload = multer({storage})

router.get("/user", (req, res) => {

    if(req.session.user) {
        res.status(200).json({
            user: req.session.user,
        });
    }
    else {
        res.status(200).json({
            user: null
        });
    }

})

router.post('/0/check', async (req, res) => {
    
    const email = req.body.email;
    const info = await User0.findOne({where: {email: email}}); 
    const info2 = await User.findOne({where: {email: email}});

    if(info){
        res.send({
            user: true,
            type: 'normal'
        })
    }
    else if(info2){
        res.send({
            user: true,
            type: 'social'
        })
    }
    else {
        res.json({user: false})
    }

});

router.post('/0/mail', async (req, res) => {

    const email = req.body.email;
    const code = Math.floor(Math.random() * 9000) + 1000;
    const value = code.toString();
    const empreinte = md5(value);

    const subjet = "CODE DE CONFIRMATION NODEJS";
    const text = "Voici votre code de confirmation : " + value;
 
    nodemailer(email, subjet, text)
    .then(() => {
        res.send({
            send: true,
            empreinte: empreinte
        });
     })
    .catch((error) => {
        res.send({
            send: false
        });
        console.log(error);
    });

})

router.post('/0/login', async (req, res) => {
    
    const email = req.body.email;
    const passw = req.body.passw;
    const user0 = await User0.findOne({where: {email: email}});

    if(user0 != null) {

        if(user0.dataValues.password === passw) {
                
            User.findAll({where: {email: email}})
            .catch((err) => {
                res.send({
                    error: true,
                    message: err
                });
            })
            .then((users) => {
                req.session.user = users[0];
                res.send({user: true, auth: true});
            });

        }
        else{
            res.send({user: true, auth: false});
        }

    }
    else {
        res.send({user: false});
    }

});

router.post('/0/signup' , upload.single('photo'), (req, res) => {

    const email = req.body.email;
    const name = req.body.name;
    const passwd = req.body.passwd;
    const id = md5(email);
    const photo = req.file ? req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename : '';
    const filepath = 'uploads/'+ req.file.filename;

    const user = {
        id: id,
        name: name, 
        email: email,
        photo: photo
    }

    User0.findOrCreate({
        where: { email: email },
        defaults: {
            password: passwd,
        }
    })
    .then(([info, created]) => {

        if(created){
            
            User.create({
                id: id,
                name: name,
                email: email,
                photo: photo
            })
            .catch((err) => {
                console.log(err)
                res.json({ error: err });
            })
            .then(() => {
                req.session.user = user;
                res.json({ message: true, user: user });
            });    

        }
        else {

            fs.access(filepath, fs.constants.F_OK, (err) => {
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.json({err});
                    }
                });
            });

            res.json({found: true})
        }

    })
    .catch(err => {
        res.json({ error: err });
    });


});



router.get('/logout', (req, res) => {

    req.logOut(() => {
        res.redirect('http://localhost:5173/');
    })

});


router.get('/google', passport.authenticate('google', { 

    scope: ['profile', 'email']

}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),

    (req, res) => {
        req.session.user = req.session.user || {};
        req.session.user.id = req.user.id;
        req.session.user.name = req.user.name;
        req.session.user.email = req.user.email;
        req.session.user.photo = req.user.photo;
        res.redirect(`${CLIENT_URL}/home`);
    }

);

module.exports = router;