const passport = require("passport");

require("dotenv").config();

const { User } = require("../models");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(

    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },
        (accessToken, refreshToken, profile, done) => {

            const ID = profile._json.sub;
            const NAME = profile._json.name;
            const EMAIL = profile._json.email;
            const PIC = profile._json.picture;

            User.findOrCreate({
                where: {id : ID},
                defaults: {
                    name: NAME,
                    email: EMAIL,
                    photo: PIC
                }
            })
            .then(([info, created]) => {

                const user = {
                    id: info.dataValues.id,
                    name: info.dataValues.name,
                    email: info.dataValues.email,
                    photo: info.dataValues.photo
                }

                done(null, user);

            })
            .catch(err => {
                done(err);
            });
        }
    )

);

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});