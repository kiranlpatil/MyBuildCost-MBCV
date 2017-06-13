import DataAccess = require("../dataaccess");
import IComplexity = require("../mongoose/complexity");
import IScenario = require("../mongoose/scenario");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ComplexitySchema {
  static get schema() {
    var schema = mongoose.Schema({
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
var schema = mongooseConnection.model<IComplexity>("Complexity", ComplexitySchema.schema);
export = schema;
