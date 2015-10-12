require('babel/register');

console.log('Start building: ', process.env.NODE_ENV);

module.exports = require('./app/webpack.client.config.js');