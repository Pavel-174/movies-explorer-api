const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const DATA_URL = 'mongodb://127.0.0.1:27017/mestodb';

mongoose
  .connect(DATA_URL)
  .then(() => {
    console.log(`App connected to database on ${DATA_URL}`);
  })
  .catch((err) => {
    console.log('Database connection error');
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
