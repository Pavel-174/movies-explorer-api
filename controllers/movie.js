const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFound('Данные не найдены!');
      }
      res.send(movies);
    })
    .catch(next);
};

const storeMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFound('Фильм с указанным _id не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() === userId) {
        return Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      }
      throw new ForbiddenError('В доступе отказано');
    })
    .catch(next);
};

module.exports = {
  getMovies,
  storeMovie,
  deleteMovieById,
};
