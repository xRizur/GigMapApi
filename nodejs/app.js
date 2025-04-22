const express = require('express');
const bandsRouter = require('./routes/bands');
const pubsRouter = require('./routes/pubs');
const requestsRouter = require('./routes/requests');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
app.set('view engine', 'ejs');
app.use(express.json());


app.use('/bands',bandsRouter);
app.use('/pubs', pubsRouter);
app.use('/uploads', express.static('uploads'));
app.use('/requests', requestsRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})