const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
//route handler looking for post requests made to '/api/stripe'
    app.post("/api/stripe", requireLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description:' $5 for 5 credits',
            source: req.body.id
        });
        //after charging user, give him 5 additional credits
        req.user.credits += 5;
        const user = await req.user.save(); // save to database
        
        res.send(user); // send new user data to browser
    });
};