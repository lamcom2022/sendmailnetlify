const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const json = require("./templates/data.json");

var AWS = require("aws-sdk");

const app = express();

const awsKey = "AKIATFIJYUE7LYNMR6K2";
const awsSecretKey = "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";

const compileData = async function (templateFile, data) {
  const filepath = path.join(process.cwd(), "templates", `${templateFile}.hbs`);

  console.log(filepath);
  const html = await fs.readFileSync(filepath, "utf8", (err) => {
    if (err) return;
  });
  // console.log(html);
  return hbs.compile(html)(data);
  // return html;
};

const s3 = new AWS.S3({
  accessKeyId: awsKey,
  secretAccessKey: awsSecretKey,
});

app.get("/", async (req, res, err) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });

    const page = await browser.newPage();

    // await page.goto("https://developer.chrome.com/");

    // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    var content = await compileData("template", json);
    await page.setContent(content);

    const pdfPath = `./pdf/output_${Date.now()}.pdf`;
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printbackground: true,
    });

    // Type into search box
    //   await page.type(".search-box__input", "automate beyond recorder");

    // Wait and click on first result
    //   const searchResultSelector = ".search-box__link";
    //   await page.waitForSelector(searchResultSelector);
    //   await page.click(searchResultSelector);

    // Locate the full title with a unique string
    //   const textSelector = await page.waitForSelector(
    //     "text/Customize and automate"
    //   );
    //   const fullTitle = await textSelector.evaluate((el) => el.textContent);

    // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close();

    console.log("pdf created");

    let pdf = fs.readFileSync(pdfPath);

    const params = {
      Bucket: "savepdf/mindnbeyond",
      Key: `output${Date.now()}.pdf`,
      Body: pdf,
      ContentType: "application/pdf",
    };
    await s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        res.json({
          url: data.Location,
          status: "pdf created",
        });
        fs.unlinkSync(pdfPath);
      }
    });

    // process.exit();
  } catch (error) {
    console.log("pdferror: ", error);
  }
});

app.listen(4343, () => {
  console.log("app is running");
});
module.exports = express;
