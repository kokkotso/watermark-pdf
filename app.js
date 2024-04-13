const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/download/:email", (req, res) => {
  const axios = require("axios");
  const FormData = require("form-data");
  const fs = require("fs");
  const path = require("path");

  const pdfRestKey = process.env.PDFRESTKEY;
  console.log(pdfRestKey);

  const pdfPath = path.join(__dirname, "assets", "dummypdf.pdf");


  // console.log(pdfPath);

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
      console.log(JSON.stringify(response.data));
      res.redirect(response.data.outputUrl);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
