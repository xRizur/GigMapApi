const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

// Pobierz BASE_PATH z zmiennej środowiskowej USER z prefixem slash
const BASE_PATH = process.env.USER ? `/${process.env.USER}` : '';

// Helper do generowania URL-i dostępny w wszystkich templateach
app.locals.basePath = BASE_PATH;
app.locals.url = (path) => BASE_PATH + path;

// Statyczne pliki
app.use(BASE_PATH + '/uploads', express.static('uploads'));

// Główne endpointy
app.get(BASE_PATH + '/', (req, res) => {
  res.render('home');
});

app.get(BASE_PATH + '/bands/new', (req, res) => {
  res.render('band_form');
});

app.get(BASE_PATH + '/pubs/new', (req, res) => {
  res.render('pub_form');
});

app.get(BASE_PATH + '/requests/new', (req, res) => {
  res.render('request_form');
});

// Routery z prefixem (po definicji tras głównych)
app.use(BASE_PATH + '/bands', bandsRouter);
app.use(BASE_PATH + '/pubs', pubsRouter);
app.use(BASE_PATH + '/requests', requestsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`BASE_PATH is set to: "${BASE_PATH}"`);
});