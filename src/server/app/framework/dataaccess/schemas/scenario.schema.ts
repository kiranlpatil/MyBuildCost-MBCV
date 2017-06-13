import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ScenarioSchema {
  static get schema() {
    var schema = mongoose.Schema({
      name: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IScenario>("Scenario", ScenarioSchema.schema);
export = schema;
