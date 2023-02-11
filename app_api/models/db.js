const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1'
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

//avoid 'current server discovery and monitoring engine is deprecated
mongoose.set('useUnifiedTopology', true);

const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
        userNewUrlParser: true,
        useCreateIndex: true
    }), 1000);
}

mongoose.connection.on('connected', () => {
    console.log("mongoose connect to ${dbURI}");
});

mongoose.connection.on('error', err => {
    console.log("mongoose connection error", err);
});

mongoose.connection.on('disconnected',() => {
    console.log("Mongoose disconnected");
});

if (process.platform === 'win32'){
    const rl = readLine.createInterface ({
      input: process.stdin,
      output: process.stdout
    });
    rl.on ('SIGINT', () => {
      process.emit ("SIGINT");
    });
  }

  const gracefulShutdown = (msg, callback) => {                1
    mongoose.connection.close( () => {                         2
      console.log(`Mongoose disconnected through ${msg}`);     3
      callback();                                              3
    });
  };

  process.once('SIGUSR2', () => {                        1
    gracefulShutdown('nodemon restart', () => {          2
      process.kill(process.pid, 'SIGUSR2');              2
    });
  });
  process.on('SIGINT', () => {                           3
    gracefulShutdown('app termination', () => {          4
      process.exit(0);                                   4
    });
  });
  process.on('SIGTERM', () => {                          5
    gracefulShutdown('Heroku app shutdown', () => {      6
      process.exit(0);                                   6
    });
  });

  connect();

  require('./travlr');