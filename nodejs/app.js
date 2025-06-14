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


app.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl || '';
  next();
});


const mainRouter = express.Router();

mainRouter.use('/bands', bandsRouter);
mainRouter.use('/pubs', pubsRouter);
mainRouter.use('/uploads', express.static('uploads'));
mainRouter.use('/requests', requestsRouter);

mainRouter.get('/', (req, res) => {
  res.render('home', { baseUrl: res.locals.baseUrl || '' });
});

mainRouter.get('/bands/new', (req, res) => {
  res.render('band_form', { baseUrl: res.locals.baseUrl || '' });
});

mainRouter.get('/pubs/new', (req, res) => {
  res.render('pub_form', { baseUrl: res.locals.baseUrl || '' });
});

mainRouter.get('/requests/new', (req, res) => {
  res.render('request_form', { baseUrl: res.locals.baseUrl || '' });
});
const port = process.env.PORT || 3000;
const host = process.env.USER;
app.use('/', mainRouter);    // dla /
app.use(`/${host}`, mainRouter);      // dla /p26
// dla zmiennej const port
app.use(`/${port}`, mainRouter); // dla /3000 lub innego portu

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});