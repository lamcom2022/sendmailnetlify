const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");

var fs = require('fs');
var pdf = require('html-pdf');

const app = express();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

let transporter;

function SetTransportDetails(transportusername, transportpwd) {
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
        text: "Test PDF email",
        from: `${req.body.first_name}`,
        email: `${req.body.email}`,
        phone: `${req.body.phone_number}`,
        company: `${req.body.company}`,
        message: `${req.body.description}`,
        attachments: [
            {
                "filname": "Test.pdf",
                path: "./Test.pdf"
            }]
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail',
                error: err
            })
        } else {
            res.json({
                status: 'success',
            })
        }
    })
})






router.post('/sendmailwithattachment', (req, res, next) => {
    // SetTransportDetails(req.body.transportusername, req.body.transportpwd);
    const bodyData = req.body;

    var htmlcode = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mind & Beyond</title>
    </head>
    
    <body>
    
        <section id="pdfdoc" class="w-full py-24 mx-auto bg-white">
            <div class="max-w-5xl px-12 mx-auto xl:px-12">
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    CONFIDENTIALITY
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            The policies, methods, and particular concerns for Teletherapy are
                            laid out in this consent form. Teletherapy is a therapy conducted
                            over the phone or through a video conference.
                        </p>
                        <p class="text-gray-700 py-3">
                            In accordance with legal and ethical norms, information about your
                            treatment will be kept confidential and will not be shared without
                            your expressed consent, with the exception of the following
                            situations, in accordance with legal and ethical norms:
                        </p>
                        <ul class="list-disc text-gray-700 py-3 gap-3 justify-between">
                            <li>
                                When a person is deemed to be a risk to themselves or others.
                            </li>
                            <li>
                                When there is a reasonable suspicion of child, elder, or dependent
                                adult abuse or neglect.
                            </li>
                            <li>
                                When there is a medical emergency that renders a person unable.
                            </li>
                            <li>When a court order is received.</li>
                        </ul>
                        <p class="text-gray-700 py-3">
                            In such a case, I will do all in my power to let you know what
                            reports need to be filed with the appropriate authorities to ensure
                            your safety and the safety of others.
                        </p>
                    </div>
                </div>
    
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    LENGTH AND FREQUENCY OF TREATMENT
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            Sessions in psychotherapy last 50 minutes and are scheduled on a
                            regular basis. Time and frequency is different
                            <span class="text-red-600 text-lg">for different clients</span>.
                            Couples and family therapy are dependent on the nature of your
                            worries and requirements, scheduled weekly for 75-minute sessions,
                            whereas individual therapy is often planned weekly for 50 minute
                            sessions.
                        </p>
                        <p class="text-gray-700 py-3">
                            Depending on the nature of your requirements and concerns, duration
                            and frequency can vary.
                        </p>
                    </div>
                </div>
    
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    FEE AND CANCELATION
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            My fee varies for individual, family and couple’s therapy and it
                            also includes GST as Mind & Beyond is registered with the
                            government. The fee details will be mentioned in the email sent to
                            you once the intake form is submitted.
                        </p>
                        <p class="text-gray-700 py-3">
                            Your session time is set out just for you, so you are in charge of
                            it. There must be a minimum of 48 hours' notice for cancellations. A
                            standard cost will be charged if a session is cancelled with less
                            than 48 hours' notice before the scheduled start time. In rare
                            circumstances, you may not be held liable for the missed appointment
                            if a consensual decision is made to reschedule an appointment that
                            was cancelled with less than 48 hours' notice.
                        </p>
                    </div>
                </div>
    
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    WHAT TO EXPECT
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            Psychotherapy has both benefits and drawbacks. Risks can include
                            having unpleasant feelings, which frequently requires talking about
                            the negative issues of your life. Psychotherapy, however, has been
                            proved to provide advantages for those who use it. However, there
                            are no assurances as to what will occur. You must take a lot of
                            effort throughout psychotherapy. You will need to put the things we
                            cover <span class="text-red-600"> during</span> sessions into
                            practise in order for the therapy to be most effective.
                        </p>
                    </div>
                </div>
    
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    POLICIES SPECIFIC TO TELETHERAPY
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            Due to the fact that there is now no media capable of guaranteeing
                            100% secure transmission, online appointments cannot be guaranteed
                            to be secure and private.
                        </p>
                        <p class="text-gray-700 py-3">
                            I, as your therapist, agree to work with you in a private setting
                            through the internet. Any security or confidentiality breaches
                            brought on by my surroundings, the internet, or other technological
                            interference are not my responsibility.
                        </p>
                        <p class="text-gray-700 py-3">
                            You, the client, are aware that compared to in-person sessions,
                            online and telephone therapy may have some drawbacks, including the
                            absence of "personal" face-to-face interactions and visual and aural
                            clues. You are aware that medicine taken under a doctor's or
                            psychiatrist's supervision cannot be replaced by phone or internet
                            psychotherapy. You are aware that getting treatment via the phone or
                            the internet might not be a good idea if you are in a crisis or
                            thinking of harming yourself or someone else. You consent to calling
                            the suicide prevention hotline at 1800-599-0019 in the event of a
                            life-threatening emergency or visiting an emergency department at a
                            hospital.
                        </p>
                        <p class="text-gray-700 py-3">
                            On weekdays, messages are checked during work hours. Weekend and
                            holiday check-ins on messages are not guaranteed. Email should not
                            be used for personal or process writing; rather, it should only be
                            used to schedule meetings or request logistical information. Any
                            invitations sent to me via social networking sites will not be
                            accepted.
                        </p>
                        <p class="text-gray-700 py-3">
                            We advise you to always use secure electronic communication
                            channels, like those that can guarantee secrecy. Make sure you
                            finish all correspondence and online counselling sessions. Please
                            make an effort to reconnect within 10 minutes if a technical issue
                            prevents you and your therapist from speaking during a session. Send
                            an email to your therapist to set up a new appointment if
                            reconnection is not possible.
                        </p>
                    </div>
                </div>
                <h1 class="mb-12 text-xl font-bold text-left md:text-3xl">
                    CONSENT FOR TREATMENT
                </h1>
                <div class="flex items-start justify-start mb-12">
                    <div>
                        <p class="text-gray-700">
                            By signing below, I show that I agree to abide by the above policies and give consent to
                            treatment.
                        </p>
    
                        <!-- customer form details -->
                        <div class="grid">
                            <form name="Tpolicy" id="Tpolicy" class="space-y-8" method="POST">
                                <div class="mt-4 w-3/4 grid lg:grid-cols-2 md:grid-cols-1">
                                    <label for="first-name" class="text-sm font-medium text-gray-700 py-3">Name: </label>
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name">
                                </div>
                                <div class="mt-4 w-3/4 grid lg:grid-cols-2 md:grid-cols-1">
                                    <label for="first-name" class="text-sm font-medium text-gray-700 py-3">Date: </label>
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name">
                                </div>
                                <div class="mt-4 w-3/4 grid lg:grid-cols-2 md:grid-cols-1">
                                    <label for="first-name" class="text-sm font-medium text-gray-700 py-3">${req.body.first_name}
                                    </label>
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name">
                                </div>
    
                                <button
                                    class="w-32 h-12 bg-primary rounded-lg border-2 border-yellow-500 py-3 mt-12 hover:bg-yellow-500"
                                    type="submit">
                                    ${req.body.email}
                                </button>
                            </form>
                        </div>
    
                    </div>
    
                </div>
    
            </div>
        </section>
    </body>
    
    </html>`

    var html = fs.readFileSync("mindbeyondpolicy.html", 'utf8');
    var options = { format: 'Letter' };


    pdf.create(html, options).toFile('./businesscard.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });

});



router.get("/", (req, res) => {
    res.json({
        status: "Success"
    });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
