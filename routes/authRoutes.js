const passport = require('passport');

module.exports = app => {
    app.get(
    // when user gets to this path, kick in authen ticate process
    "/auth/google",
    passport.authenticate("google", {
        // hey Passport , attempt to authenticate the user that is coming in to this route, and use strategy called 'google'
        scope: ["profile", "email"]
    })
    );
    // exchange code for user profile
    app.get(
        "/auth/google/callback", 
        passport.authenticate("google"),
        (req,res) => { //where do we send user after authenticating?
            res.redirect('/surveys');
        }
    );

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect("/");

    })

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};