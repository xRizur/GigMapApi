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
app.set('views', path.join(__dirname, 'views')); // Ścieżka do szablonów EJS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRouter = express.Router();
const host = process.env.USER; // Np. 'p26'
const actualBasePath = host ? `/${host}` : ''; // Wynik: '/p26' lub ''

// Udostępnij 'baseUrl' wszystkim szablonom EJS.
// Ta zmienna będzie zawierać prefiks aplikacji (np. '/p26').
app.use((req, res, next) => {
  res.locals.baseUrl = actualBasePath;
  next();
});

// Serwowanie ogólnych zasobów statycznych (np. CSS, JS) z katalogu 'public'
// Zakładamy, że katalog 'public' jest na tym samym poziomie co 'nodejs', czyli w /workspaces/GigMapApi/public
// Te zasoby będą dostępne pod adresem: <%= baseUrl %>/nazwa_pliku.css (np. /p26/style.css)
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(actualBasePath, express.static(publicDirectoryPath));

// Definicje tras w głównym routerze
mainRouter.use('/bands', bandsRouter);
mainRouter.use('/pubs', pubsRouter);
// Serwowanie zasobów z katalogu 'uploads' (np. obrazki)
// Dostępne pod adresem: <%= baseUrl %>/uploads/nazwa_obrazka.jpg (np. /p26/uploads/obrazek.jpg)
mainRouter.use('/uploads', express.static(path.join(__dirname, '../uploads')));
mainRouter.use('/requests', requestsRouter);

mainRouter.get('/', (req, res) => {
  // res.locals.baseUrl jest już dostępne w szablonie
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

// Zamontuj główny router aplikacji pod ustalonym 'actualBasePath'
// Jeśli 'actualBasePath' to '/p26', wszystkie trasy z mainRouter będą dostępne pod /p26/nazwa_trasy
// Jeśli 'actualBasePath' jest puste, trasy będą dostępne pod /nazwa_trasy
app.use(actualBasePath, mainRouter);

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
    if (actualBasePath) {
        console.log(`Aplikacja dostępna pod adresem: http://localhost:${port}${actualBasePath}`);
    } else {
        console.log(`Aplikacja dostępna pod adresem: http://localhost:${port}`);
    }
});