const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());
const transport = {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "info@lamhouse.in",
        pass: "am@zecH12#",
    },
}
const transporter = nodemailer.createTransport(transport)
transporter.verify((error, success) => {
    if (error) {
        //if error happened code ends here
        console.error(error)
    } else {
        //this means success
        console.log('Ready to send mail!')
    }
})

router.post('/sendmail', (req, res, next) => {
    //make mailable object
    debugger
    //alert(req)
    console.log("Email_Router===", req.body.first_name);
    
    const mail = {
        // from: process.env.SMTP_FROM_EMAIL,
        from: "info@lamhouse.in",
        //to: process.env.SMTP_TO_EMAIL,
        //to: "pradeephari1594@gmail.com",
        to: req.body.email,
        cc: "sureshbabuweb@gmail.com,ravintherr.r@gmail.com",
        bcc: "sureshbabu73@gmail.com",
        subject: 'New Contact Form Submission',
        text: `
        from: "${req.body.first_name}"
        email: "${req.body.email}"
        phone: "${req.body.phone_number}"
        company: "${req.body.company}"
        message:"${req.body.description}"`,
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail',
            })
        } else {
            res.json({
                status: 'success Hi',
            })
        }
    })
})

router.get("/", (req, res) => {
  debugger
  res.json({
    //hello: "hi!"
    status: "Success"
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
