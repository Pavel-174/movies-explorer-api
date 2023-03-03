const routerMovies = require('express').Router();
const { createMovie, getMovies, deleteMovieById } = require('../controllers/movie');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

routerMovies.get('/', getMovies);
routerMovies.post('/', validationCreateMovie, createMovie);
routerMovies.delete('/:movieId', validationDeleteMovie, deleteMovieById);

module.exports = routerMovies;
