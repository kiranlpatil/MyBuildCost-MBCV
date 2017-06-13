import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class LocationSchema {
  static get schema() {
    var schema = mongoose.Schema({
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      pin: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<ILocation>("Location", LocationSchema.schema);
export = schema;
