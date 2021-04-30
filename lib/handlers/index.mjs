export { ping } from './ping.mjs';
export const notFound = (data, callback) => {
  callback(404, { message: 'specified route not found' });
};
