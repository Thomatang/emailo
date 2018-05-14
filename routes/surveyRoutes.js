const mongoose = require ('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); 

module.exports = app => {
    app.get('/api/surveys/thanks', (req,res)=> {
        res.send('Thanks for voting!');
    })


    app.post('/api/surveys', requireLogin, requireCredits, async (req,res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title: title,
            subject: subject,
            body: body,
            recipients: recipients.split(',').map(email => { return {email: email.trim() }}),// this line of code will take the list of email addresses, split it into an array and return an object for every email with a property of email that has a value of email
            _user: req.user.id,
            dateSent: Date.now()
        });
        //great place to send an email
        const mailer = new Mailer(survey, surveyTemplate(survey));
        
        try{
            await mailer.send();
            await survey.save();
            req.user.credits -=1;
            const user = await req.user.save();

            res.send(user); // update number of credits
        }catch (err) {
            res.status(422).send(err);
        }
        
    })

};