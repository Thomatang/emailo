const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url'); // integrated module in Node
const mongoose = require ('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys'); 

module.exports = app => {

    //lecture 188 Fetching a List of Surveys
    app.get('/api/surveys', requireLogin, async (req, res) => {
        //fetch from mongDB all surveys where _id = current user's id
        const surveys = await Survey.find({_user: req.user.id})
            .select({recipients: false}); // do not show list of recipients in dashboard
        
        res.send(surveys);
    });


    app.get('/api/surveys/:surveyId/:choice', (req,res)=> {
        res.send('Thanks for voting!');
    });

    //Lecture 177-8
    app.post('/api/surveys/webhooks', (req, res)=> {
        const p = new Path("/api/surveys/:surveyId/:choice");
        //big refactor using lodash chain helper, lecture 180
        //iterate over req.body , map over it, compact it, do a uniqueness check and return a value
         _.chain(req.body)
            .map(({ email, url })=> {
                //extract the path from the URL
                const match = p.test(new URL(url).pathname);
                if(match){
                    return { email, surveyId: match.surveyId, choice: match.choice};
                }
            })
            // remove undefined elements with compact lodash helper, Lecture 179
            .compact()
            //remove duplicate records with uniq lodash helper, Lecture 179
            .uniqBy( 'email', 'surveyId')
            .each(({surveyId, email, choice}) =>{
                //updating records in MongoDB, lecture 183
                // find a record with given criteria, after record is found , take the second object and update the record with it
                Survey.updateOne(
                    { 
                    _id: surveyId, 
                    recipients: { $elemMatch: { email: email, responded: false } 
                }
                }, { 
                    $inc: { [choice]: 1 }, //$inc and $set are mongo operators!! //increment the choice (yes or no) by 1.
                    $set: { "recipients.$.responded": true },
                    lastResponded: new Date()
                          }).exec()
            .value();

                res.send({});
            
            })
        }
    );


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