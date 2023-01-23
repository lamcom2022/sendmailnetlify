var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();
// app.use(express.static('assets'));
var router =  express.Router();


var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");

// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// app.use(cors())

// var server = app.listen(9001, function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("Example app listening at http://%s:%s", host, port)
// });

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
    html: '',
    data: {},
    path: "output_1.pdf",
    // type: "buffer", // "stream" || "buffer" || "" ("" defaults to pdf)
};

router.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + 'index.html');
});
router.get('/generate', function (req, res) {
    

    var html = fs.readFileSync("src/mindbeyondpolicy.html", "utf8");
    
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
        ]
    }
    pdf.create(document, options).then((pdfResp) => {
        console.log("generate");
        res.contentType("application/json");
        // res.send(pdfResp);
        res.json({
            success: true
        })
    })
    .catch((error) => {
        res.send(error);
    });
    
    // .toFile("./output.pdf", (err, res)=>{
    //     console.log(err);
    // });
});
module.exports = router;