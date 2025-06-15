const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const userPrefix = process.env.USER || 'default_user';
const basePath = `/${userPrefix}`;
app.locals.basePath = basePath; // Udostępnienie basePath dla wszystkich szablonów EJS

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${basePath}/bands`, bandsRouter);
app.use(`${basePath}/pubs`, pubsRouter);
app.use(`${basePath}/uploads`, express.static('uploads'));
app.use(`${basePath}/requests`, requestsRouter);

app.get(`${basePath}/`, (req, res) => {
  res.render('home');
});

app.get(`${basePath}/bands/new`, (req, res) => {
  res.render('band_form');
});

app.get(`${basePath}/pubs/new`, (req, res) => {
  res.render('pub_form');
});

app.get(`${basePath}/requests/new`, (req, res) => {
  res.render('request_form');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});