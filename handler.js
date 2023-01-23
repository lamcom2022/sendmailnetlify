const serverless = require('serverless-http');
const app = require('./src/api');

module.exports.hello = serverless(app);
