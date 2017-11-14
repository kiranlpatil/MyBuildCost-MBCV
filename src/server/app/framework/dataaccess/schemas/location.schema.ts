import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class LocationSchema {
  static get schema() {
    let schema = mongoose.Schema({
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
let schema = mongooseConnection.model<ILocation>("Location", LocationSchema.schema);
export = schema;
