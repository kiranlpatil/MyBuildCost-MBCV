import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class IndustrySchema {
  static get schema() {
    var schema = mongoose.Schema({
      code: {
        type: String
      },
      name: {
        type: String
      },
      sort_order: Number,
      roles: [{
        name: String,
        code: String,
        capabilities: [{
          code: String,
          complexities: [{
            code: String,
            questionForCandidate: String,
            questionForRecruiter: String,
            scenarios: [{
              name: String,
              code: String
            }],
            name: String
          }],
          name: String
        }],
        default_complexities: [{
          code: String,
          complexities: [{
            code: String,
            questionForCandidate: String,
            questionForRecruiter: String,
            scenarios: [{
              name: String,
              isChecked: Boolean,
              code: String
            }],
            name: String
          }],
          name: String
        }]
      }],
      proficiencies: {
        label: String,
        names: [String]
      }

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IIndustry>("Industry", IndustrySchema.schema);
export = schema;
