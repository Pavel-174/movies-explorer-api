const routerMovies = require('express').Router();
const { storeMovie, getMovies, deleteMovieById } = require('../controllers/movie');
const { validationStoreMovie, validationDeleteMovie } = require('../middlewares/validation');

routerMovies.get('/', getMovies);
routerMovies.post('/', validationStoreMovie, storeMovie);
routerMovies.delete('/:movieId', validationDeleteMovie, deleteMovieById);

module.exports = routerMovies;
