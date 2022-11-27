const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

let transporter;

function SetTransportDetails(transportusername, transportpwd){
    let transport = {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: transportusername,
            pass: transportpwd,
        },
    }
    transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
        if (error) {
            //if error happened code ends here
            console.error(error)
        } else {
            //this means success
            console.log('Ready to send mail!')
        }
    })

}

router.post('/sendmail', (req, res, next) => {


    SetTransportDetails(req.body.transportusername, req.body.transportpwd);

    //make mailable object
    const mail = {
        from: req.body.frommail,
        to: req.body.email,
        cc: req.body.ccmail,
        bcc: req.body.bccmail,
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
                status: 'success',
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
