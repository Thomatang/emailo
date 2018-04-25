const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require("./models/User");
require('./services/passport');



mongoose.connect(keys.mongoURI);

const app = express(); // used to setup configuration that will listen to incoming requests and route them to different handlers

app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000, // cookie willlast for 30 days before it expires
        keys:[keys.cookieKey]
    })
);


app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);// valid JS: when we require the authRoute file, it returns a function, we then immediately call that function with the app object 


const PORT = process.env.PORT || 5000;
app.listen(PORT);