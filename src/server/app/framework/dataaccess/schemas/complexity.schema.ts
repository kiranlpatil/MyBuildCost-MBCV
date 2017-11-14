import DataAccess = require("../dataaccess");
import IComplexity = require("../mongoose/complexity");
import IScenario = require("../mongoose/scenario");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class ComplexitySchema {
  static get schema() {
    let schema = mongoose.Schema({
      name: {
        type: String
      },
      scenarios: [{
        type: String
      }],


    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IComplexity>("Complexity", ComplexitySchema.schema);
export = schema;
