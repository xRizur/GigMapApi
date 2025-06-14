const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/bands', bandsRouter);
app.use('/pubs', pubsRouter);
app.use('/uploads', express.static('uploads'));
app.use('/requests', requestsRouter);

app.use((req, res, next) => {
  let baseUrl = req.baseUrl || '';
  if (!baseUrl || baseUrl === '/') {
    baseUrl = '';
  }
  res.locals.baseUrl = baseUrl;
  next();
});

app.get('/', (req, res) => {
  res.render('home', { baseUrl: res.locals.baseUrl });
});

app.get('/bands/new', (req, res) => {
  res.render('band_form', { baseUrl: res.locals.baseUrl });
});

app.get('/pubs/new', (req, res) => {
  res.render('pub_form', { baseUrl: res.locals.baseUrl });
});

app.get('/requests/new', (req, res) => {
  res.render('request_form', { baseUrl: res.locals.baseUrl });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});