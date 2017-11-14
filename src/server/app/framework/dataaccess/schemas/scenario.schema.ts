import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class ScenarioSchema {
  static get schema() {
    let schema = mongoose.Schema({
      name: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IScenario>("Scenario", ScenarioSchema.schema);
export = schema;
