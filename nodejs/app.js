const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

let basePath = process.env.USER || '';
if (basePath === '/') {
  basePath = ''; 
} else {
  if (basePath && !basePath.startsWith('/')) {
    basePath = '/' + basePath; 
  }
  if (basePath && basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1);
  }
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.basePath = basePath;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(basePath + '/bands', bandsRouter);
app.use(basePath + '/pubs', pubsRouter);
app.use(basePath + '/uploads', express.static('uploads'));
app.use(basePath + '/requests', requestsRouter);

app.get(basePath + '/', (req, res) => {
  res.render('home');
});

app.get(basePath + '/bands/new', (req, res) => {
  res.render('band_form');
});

app.get(basePath + '/pubs/new', (req, res) => {
  res.render('pub_form');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});