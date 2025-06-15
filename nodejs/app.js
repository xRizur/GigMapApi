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

const mainRouter = express.Router();
const host = process.env.USER;

mainRouter.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl; // req.baseUrl to ścieżka, pod którą mainRouter jest zamontowany
  next();
});


mainRouter.use(express.static(path.join(__dirname, 'public')));

mainRouter.use('/bands', bandsRouter);
mainRouter.use('/pubs', pubsRouter);
mainRouter.use('/uploads', express.static(path.join(__dirname, '../uploads')));
mainRouter.use('/requests', requestsRouter);

mainRouter.get('/', (req, res) => {
  res.render('home'); // res.locals.baseUrl będzie dostępne
});

mainRouter.get('/bands/new', (req, res) => {
  res.render('band_form'); // res.locals.baseUrl będzie dostępne
});

mainRouter.get('/pubs/new', (req, res) => {
  res.render('pub_form'); // res.locals.baseUrl będzie dostępne
});

mainRouter.get('/requests/new', (req, res) => {
  res.render('request_form'); // res.locals.baseUrl będzie dostępne
});

const port = process.env.PORT || 3000;

// Montujemy mainRouter pod ścieżką główną
app.use('/', mainRouter);

// Jeśli host (np. p26) jest zdefiniowany, montujemy mainRouter również pod tym prefiksem
if (host) {
  app.use(`/${host}`, mainRouter);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`App available at http://localhost:${port}`);
    if (host) {
        console.log(`App also available at http://localhost:${port}/${host}`);
    }
});