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
const actualBasePath = host ? `/${host}` : '';

app.use((req, res, next) => {
  res.locals.baseUrl = actualBasePath;
  next();
});



mainRouter.use('/bands', bandsRouter);
mainRouter.use('/pubs', pubsRouter);
mainRouter.use('/uploads', express.static(path.join(__dirname, '../uploads')));
mainRouter.use('/requests', requestsRouter);

mainRouter.get('/', (req, res) => {
  res.render('home');
});

mainRouter.get('/bands/new', (req, res) => {
  res.render('band_form');
});

mainRouter.get('/pubs/new', (req, res) => {
  res.render('pub_form');
});

mainRouter.get('/requests/new', (req, res) => {
  res.render('request_form');
});

const port = process.env.PORT || 3000;


app.use(actualBasePath, mainRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    if (actualBasePath) {
        console.log(`App available at http://localhost:${port}${actualBasePath}`);
    } else {
        console.log(`App available at http://localhost:${port}`);
    }
});