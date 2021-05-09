const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// const { RESTClient } = require('cw-sdk-node')
const axios = require('axios')
const got = require('got');
const utils = require('./utils/utils');
const apiRoutes = require('./routes/api')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//
// const client = new RESTClient({
//   creds: {
//     apiKey: "NPB0Z2I1QFUJQZ7JYA0C" // your cw api key
//   }
// });

app.use('/api', apiRoutes)

app.use(express.static(path.join(__dirname, "client", "build")))
// app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build','index.html'))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
