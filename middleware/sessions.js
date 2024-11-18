const session = require('express-session');
const connectMongo = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config(); 

const MongoStore = connectMongo(session);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: process.env.MONGODB_URI }), 
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
  },
};

module.exports = sessionConfig;
