const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require("./models/User");
require('./models/Survey');
require('./services/passport');



mongoose.connect(keys.mongoURI);

const app = express(); // used to setup configuration that will listen to incoming requests and route them to different handlers


app.use(bodyParser.json()); // MIDDLEWARE

app.use( // MIDDLEWARE
    cookieSession({
        maxAge: 30*24*60*60*1000, // cookie willlast for 30 days before it expires
        keys:[keys.cookieKey]
    })
);


app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);// valid JS: when we require the authRoute file, it returns a function, we then immediately call that function with the app object 
require("./routes/billingRoutes")(app);// same here as previous line of code
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production'){ // environment variable setup by heroku
// Express will serve up production assets
//like our main.js file, or main css file
app.use(express.static('client/build'));

//Express will serve up the index.html file if it does not recognize the route
const path = require('path');
app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);