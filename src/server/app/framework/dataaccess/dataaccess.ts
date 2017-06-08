import * as Mongoose from "mongoose";
//import * as config from "config";
var config = require('config');

class DataAccess {
  static mongooseInstance:any;
  static mongooseConnection:Mongoose.Connection;

  constructor() {
    DataAccess.connect();
  }

  static connect():Mongoose.Connection {
    if (this.mongooseInstance) return this.mongooseInstance;

    this.mongooseConnection = Mongoose.connection;
    this.mongooseConnection.once("open", () => {
      console.log("Connected to mongodb.");
    });

    var host = config.get("TplSeed.database.host");
    var name = config.get("TplSeed.database.name");
    this.mongooseInstance = Mongoose.connect('mongodb://' + host + '/' +name);
    return this.mongooseInstance;
  }
}
DataAccess.connect();
export = DataAccess;
