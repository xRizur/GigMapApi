const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

let publicBasePath = process.env.PORT || ''; 
if (publicBasePath && !publicBasePath.startsWith('/')) {
  publicBasePath = '/' + publicBasePath;
}
if (publicBasePath && publicBasePath.endsWith('/')) {
  publicBasePath = publicBasePath.slice(0, -1);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.basePath = publicBasePath;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/bands', bandsRouter);
app.use('/pubs', pubsRouter);
app.use('/uploads', express.static('uploads')); 
app.use('/requests', requestsRouter);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/bands/new', (req, res) => {
  res.render('band_form');
});

app.get('/pubs/new', (req, res) => {
  res.render('pub_form');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Application public base path for templates: '${publicBasePath}'`);
});