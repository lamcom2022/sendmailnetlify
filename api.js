const express = require("express");
const serverless = require("serverless-http");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const awspdf = require("./generatepdf");

const path = require("path");
var fs = require("fs");
var pdf = require("pdf-creator-node");

const app = express();
const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

app.use(router);
app.use("/pdf", awspdf);
app.use(bodyParser.urlencoded({ extended: false }));

let transporter;

function SetTransportDetails(transportusername, transportpwd) {
  let transport = {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: transportusername,
      pass: transportpwd,
    },
  };
  transporter = nodemailer.createTransport(transport);

  transporter.verify((error, success) => {
    if (error) {
      //if error happened code ends here
      console.error(error);
    } else {
      //this means success
      console.log("Ready to send mail!");
    }
  });
}

router.post("/sendmail", (req, res, next) => {
  SetTransportDetails(req.body.transportusername, req.body.transportpwd);

  console.log(req.body.email);

  //make mailable object
  const mail = {
    from: req.body.frommail,
    to: req.body.email,
    cc: "pradeephari1594@gmail.com",
    bcc: req.body.bccmail,
    subject: "New Contact Form Submission",
    text: "Test PDF email",
    from: `${req.body.first_name}`,
    email: `${req.body.email}`,
    phone: `${req.body.phone_number}`,
    company: `${req.body.company}`,
    message: `${req.body.description}`,
    attachments: [
      {
        filname: "Test.pdf",
        path: "./Test.pdf",
      },
    ],
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
        error: err,
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

var options = {
  // base: "http://localhost:8081", // or use: req.protocol + '://' + req.get('host')
  format: "A4",
  orientation: "portrait",
  border: "10mm",
  // header: {
  //     height: "100px",
  //     contents: '<div style="text-align: center;">Code Studio</div>'
  // },
  // footer: {
  //     height: "28mm",
  //     contents: {
  //         first: 'Cover page',
  //         2: 'Second page', // Any page number is working. 1-based index
  //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
  //         last: 'Last Page'
  //     }
  // }
};
let pdfDocument = {
  html: "",
  data: {},
  path: "output_1.pdf",
  // type: "buffer", // "stream" || "buffer" || "" ("" defaults to pdf)
};

router.post("/sendmailwithattachment", (req, res, next) => {
  var html = fs.readFileSync("src/mindbeyondpolicy.html", "utf8");
  // var html = fs.readFile("src/mindbeyondpolicy.html");

  let document = { ...pdfDocument };
  document.html = html;
  document.data = {
    users: [
      {
        name: "Shyam",
        age: "26",
      },
      {
        name: "Navjot",
        age: "26",
      },
      {
        name: "Vitthal",
        age: "26",
      },
    ],
  };

  pdf.create(document, options).then((pdfResp) => {
    res.contentType("application/json");
    res.send(pdfResp);

    res.json({
      data: "Success",
    });
    SetTransportDetails(req.body.transportusername, req.body.transportpwd);

    const mail = {
      from: req.body.frommail,
      to: req.body.email,
      cc: "pradeephari1594@gmail.com",
      bcc: req.body.bccmail,
      subject: "New Contact Form Submission",
      text: "Test PDF email",
      from: `${req.body.first_name}`,
      email: `${req.body.email}`,
      phone: `${req.body.phone_number}`,
      company: `${req.body.company}`,
      message: `${req.body.description}`,
      attachments: [
        {
          filname: "output_1.pdf",
          path: "./output_1.pdf",
        },
      ],
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          status: "fail",
          error: err,
        });
      } else {
        res.json({
          status: "success",
        });
      }
    });
  });
});

router.get("/", (req, res) => {
  res.json({
    status: "Success",
  });
});

module.exports = app;
