const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15000 * 60 * 1000,
  max: 50000,
});

module.exports = { limiter };
