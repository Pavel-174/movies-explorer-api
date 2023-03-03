const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { limiter } = require('./utils/limiter');
const cors = require('./middlewares/cors');
const { requestLogger } = require('./middlewares/logger');
const { errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const handleError = require('./middlewares/handleError');
const { DATA_URL, PORT } = require('./utils/constants');

const app = express();

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

app.use(limiter);

app.use(helmet());

app.use(router);

router.use(errorLogger);
router.use(errors());
router.use((err, req, res, next) => { handleError(err, res, next); });
