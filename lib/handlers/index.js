exports.ping = require('./ping');
exports.notFound = (data, callback) => {
  callback(404, { message: 'specified route not found' });
};
