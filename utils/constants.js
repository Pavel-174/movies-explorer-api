const { PORT = 3000 } = process.env;

const DATA_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = { DATA_URL, PORT };
