import * as Mongoose from "mongoose";
//import * as config from 'config';
//var config = require('./../../../../../config1');
var config = require('config');

class DataAccess {
  static mongooseInstance: any;
  static mongooseConnection: Mongoose.Connection;


  static connect(): Mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;

    this.mongooseConnection = Mongoose.connection;
    this.mongooseConnection.once('open', () => {
      console.log('Connected to mongodb.');
    });
    var dbConfig = config.get('Customer.dbConfig');
//    var host = config.TplSeed.database.host;//config.get('TplSeed.database.host');
    //var host = '52.89.221.23';
    //var name = config.TplSeed.database.name;
    var name = 'JobMosis-staging';
    Mongoose.set('debug',true);
    this.mongooseInstance = Mongoose.connect('mongodb://' + dbConfig.host + '/' + name + '');
    return this.mongooseInstance;
  }
}
DataAccess.connect();
export = DataAccess;
