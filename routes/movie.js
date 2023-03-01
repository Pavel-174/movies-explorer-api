const routerMovies = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { storeMovie, getMovies, deleteMovieById } = require('../controllers/movie');

routerMovies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), storeMovie);

routerMovies.get('/', getMovies);
routerMovies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovieById);

module.exports = routerMovies;
