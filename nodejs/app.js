const express = require('express');
const path = require('path');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

// Użyj zmiennej środowiskowej APP_BASE_PATH do określenia publicznego prefiksu ścieżki.
// Na serwerze produkcyjnym ustaw APP_BASE_PATH na np. /p26.
// Lokalnie, jeśli nie jest ustawiona, będzie to pusty string.
// Zmieniamy źródło publicBasePath na process.env.PORT
let publicBasePath = process.env.PORT || ''; // ZMIANA TUTAJ: Użyj PORT zamiast APP_BASE_PATH
if (publicBasePath && !publicBasePath.startsWith('/')) {
  publicBasePath = '/' + publicBasePath;
}
if (publicBasePath && publicBasePath.endsWith('/')) {
  publicBasePath = publicBasePath.slice(0, -1);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  // Udostępnij publicBasePath do szablonów EJS jako 'basePath'
  res.locals.basePath = publicBasePath;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trasy są teraz definiowane bez publicBasePath.
// Serwer proxy powinien mapować np. /p26/bands na /bands w aplikacji.
app.use('/bands', bandsRouter);
app.use('/pubs', pubsRouter);
app.use('/uploads', express.static('uploads')); // Ścieżka do zasobów statycznych
app.use('/requests', requestsRouter);

// Główna strona aplikacji
app.get('/', (req, res) => {
  res.render('home');
});

// Trasy do formularzy (jeśli nie są obsługiwane wewnątrz dedykowanych routerów)
app.get('/bands/new', (req, res) => {
  res.render('band_form');
});

app.get('/pubs/new', (req, res) => {
  res.render('pub_form');
});

// Zakładamy, że /requests/new jest obsługiwane przez requestsRouter,
// więc nie ma potrzeby definiowania app.get('/requests/new', ...) tutaj,
// chyba że jest inaczej.

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Application public base path for templates: '${publicBasePath}'`);
});