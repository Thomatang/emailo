const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose');
const keys = require("../config/keys");

const User = mongoose.model('users'); // model class


passport.serializeUser ((user, done) => { // turn mongoose user model instance into id
  done(null, user.id);
})

passport.deserializeUser((id, done) => {  // turn id into a mongoose model instance
  User.findById(id)
    .then(user => {
      done(null, user);
    })
})


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id}).then(existingUser => {
          if (existingUser) {
            //we already have a record with the given profgile ID
            done(null, existingUser);
          } else {
            // we don't have a record with this user ID, create a new record
            new User({ googleId: profile.id })
              .save() // creates new instance of User and save it to the database for us
              .then(user => done(null, user));
          }
        });
    }
  )
);
