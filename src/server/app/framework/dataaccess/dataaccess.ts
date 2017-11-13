import * as Mongoose from 'mongoose';
let config = require('config');

class DataAccess {
  static mongooseInstance: any;
  static mongooseConnection: Mongoose.Connection;


  static connect(): Mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;

    this.mongooseConnection = Mongoose.connection;
    this.mongooseConnection.once('open', () => {
      console.log('Connected to mongodb.');
    });

    let host = config.get('TplSeed.database.host');
    let name = config.get('TplSeed.database.name');
    Mongoose.set('debug',true);
    this.mongooseInstance = Mongoose.connect('mongodb://admin:jobmosisadmin123@' + host + '/' + name+'');
    //this.mongooseInstance = Mongoose.connect('mongodb://' + host + '/' + name+'');
    return this.mongooseInstance;
  }
}
DataAccess.connect();
export = DataAccess;
