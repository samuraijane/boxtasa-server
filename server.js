require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();
app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
  const host = req.headers.origin;
  let whitelist = [
    'http://shrouded-island-13135.herokuapp.com',
    'http://localhost:4200'
  ];
  whitelist.forEach((item, index) => {
    if(host.indexOf(item) > -1) {
      res.header("Access-Control-Allow-Origin", host);
    }
  })
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST, PUT');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const {PORT, LOCAL_DB, CLOUD_DB} = require('./config');
const {codesRouter} = require('./routes');

app.use('/codes', codesRouter);


let server;

// for local database, use "databaseUrl=LOCAL_DB"
// for cloud database hosted by mLab, use "databaseUrl=CLOUD_DB"
function runServer(databaseUrl=CLOUD_DB, port=PORT) {
  let promise = new Promise( (resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if(err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`The server is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
  return promise;
}

function closeServer() {
  return mongoose.disconnect()
    .then( () => {
      let promise = new Promise( (resolve, reject) => {
        console.log('Closing server...');
        server.close(err => {
          if(err) {
            return reject(err);
          }
          resolve();
        })
      });
      return promise;
    });
}

if(require.main === module) {
  runServer()
  .catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};