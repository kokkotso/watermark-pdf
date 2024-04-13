const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');

    const pdfRestKey = process.env.PDFRESTKEY;

    const pdfPath = path.join(__dirname, 'assets', 'dummypdf.pdf');

    console.log(pdfPath);
    
    const data = new FormData();
    data.append('file', fs.createReadStream(pdfPath));
    data.append("watermark_text", "This file was generated for testing.");
    
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.pdfrest.com/watermarked-pdf',
        headers: {
            'Api-Key': 'afc79ba2-29a7-49cb-b088-3d8d9792b351',
            ...data.getHeaders()
        },
        data: data
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