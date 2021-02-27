const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const { RESTClient } = require('cw-sdk-node')
const axios = require('axios')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new RESTClient({
  creds: {
    apiKey: "NPB0Z2I1QFUJQZ7JYA0C" // your cw api key
  }
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/exchanges', (req, res) => {
  client.getExchanges()
  .then((exchanges) => {
    res.send({ exchanges })
  })
});

app.get('/api/ohlc', (req, res) => {
  axios.get('https://api.cryptowat.ch/markets/kraken/ethusd/ohlc')
  .then(res => res.data)
  .then((candles) => {
    console.log('got a request')
    res.json(candles.result['300'])
  })
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
