const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const { requestLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

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

app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(router);

router.use(errorLogger);
router.use(errors());
router.use((err, req, res, next) => { handleError(err, res, next); });
