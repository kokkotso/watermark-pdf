// use environment variables
const dotenv = require("dotenv");
dotenv.config();

// use express
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// main route
app.get("/download/:email", (req, res) => {
  const axios = require("axios");
  const FormData = require("form-data");
  const fs = require("fs");
  const path = require("path");

  const pdfRestKey = process.env.PDFRESTKEY;

  const pdfPath = path.join(__dirname, "assets", "dummypdf.pdf");

  const email = req.params.email;

  const data = new FormData();
  data.append("file", fs.createReadStream(pdfPath));

  // watermark display config
  data.append(
    "watermark_text",
    `CONFIDENTIAL, DO NOT SHARE.\nGenerated for exclusive use by:\n${email}`
  );
  data.append("font", "arial");
  data.append("text_size", "24");
  data.append("text_color_rgb", "0,42,78");
  data.append("x", "174");
  data.append("y", "360");

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.pdfrest.com/watermarked-pdf",
    headers: {
      "Api-Key": `${pdfRestKey}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      const watermarkedPdf = response.data.outputUrl;
      // console.log(JSON.stringify(response.data));
      res.render('pages/index', {
        watermarkedPdf: watermarkedPdf
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// start app
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
