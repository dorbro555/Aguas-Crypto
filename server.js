const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios')
const got = require('got');
const expressSession = require('express-session')
const passport = require('passport');
const auth0Strategy = require('passport-auth0');
require("dotenv").config();

// const { RESTClient } = require('cw-sdk-node')
const utils = require('./utils/utils');
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')



const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//
// const client = new RESTClient({
//   creds: {
//     apiKey: "NPB0Z2I1QFUJQZ7JYA0C" // your cw api key
//   }
// });

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

const strategy = new auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
)


app.use(express.static(path.join(__dirname, "client", "build")))

app.use(expressSession(session))
/*
* Initialize passport below
*/
passport.use(strategy)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})
app.use('/', authRoutes)
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build','index.html'))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
