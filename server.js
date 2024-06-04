const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios')
const got = require('got');
const expressSession = require('express-session')
// const passport = require('passport');
// const auth0Strategy = require('passport-auth0');
const util = require('util')
const { spawn } = require('child_process')
const cors = require('cors');
require("dotenv").config();

// const { RESTClient } = require('cw-sdk-node')
const utils = require('./utils/utils');
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}

if (app.get("env") === "production") {
  // Serve secure cookies, requiring HTTPS
  session.cookie.secure = true;
}

// TODO reimplement auth0
// const strategy = new auth0Strategy(
//   {
//     domain: process.env.AUTH0_DOMAIN,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     clientSecret: process.env.AUTH0_CLIENT_SECRET,
//     callbackURL: process.env.AUTH0_CALLBACK_URL
//   },
//   function(accessToken, refreshToken, extraParams, profile, done) {
//     /**
//      * Access tokens are used to authorize users to an API
//      * (resource server)
//      * accessToken is the token to call the Auth0 API
//      * or a secured third-party API
//      * extraParams.id_token has the JSON Web Token
//      * profile has all the information from the user
//      */
//     return done(null, profile);
//   }
// )

// setImmediatePromise(setTimeout(()=>5, 8000)).then((val) => {console.log('scanning done!: ' + val)})

// async function runJobs(){
//   let theval = await setImmediatePromise(analyzeMarket('btc'))
//   console.log('Initial scan finished!: ' + theval)
//   setInterval(console.log, 2000, 'ada')
// }
// runJobs()
// setImmediate(() => {
//   const child = spawn('node', ['jobs/scan.js'])
//   child.stdout.on('data', data => {
//     console.log(`stdout:\n${data}`);
//   });

//   child.stderr.on('data', data => {
//     console.error(`stderr: ${data}`);
//   });

//   child.on('error', (error) => {
//     console.error(`error: ${error.message}`);
//   });

//   child.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
// })

app.use(express.static(path.join(__dirname, "client", "build")))

// TODO add this back in
// app.use(expressSession(session))

// TODO implement passport again
/*
* Initialize passport below
*/
// passport.use(strategy)
// app.use(passport.initialize())
// app.use(passport.session())

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// TODO implement auth
// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.isAuthenticated()
//   next()
// })
app.use('/', authRoutes)
app.use('/api', apiRoutes)
app.use('/api', cors())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build','index.html'))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
