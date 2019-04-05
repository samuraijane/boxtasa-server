const {router: authRouter} = require('./authRouter');
const {router: codesRouter} = require('./codesRouter');
const {router: usersRouter} = require('./usersRouter');

module.exports = {authRouter, codesRouter, usersRouter};
