import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class IndustrySchema {
  static get schema() {
    let schema = mongoose.Schema({
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
        sort_order: Number,
        capabilities: [{
          sort_order: Number,
          code: String,
          complexities: [{
            code: String,
            sort_order: Number,
            question:String,
            questionForCandidate: String,
            questionForRecruiter: String,
            questionHeaderForCandidate: String,
            questionHeaderForRecruiter: String,
            scenarios: [{
              name: String,
              code: String
            }],
            name: String
          }],
          name: String
        }],
        default_complexities: [{
          sort_order: Number,
          code: String,
          complexities: [{
            sort_order: Number,
            code: String,
            questionForCandidate: String,
            questionForRecruiter: String,
            questionHeaderForCandidate: String,
            questionHeaderForRecruiter: String,
            scenarios: [{
              name: String,
              isChecked: Boolean,
              code: String
            }],
            name: String
          }],
          name: String
        }]
      }]

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IIndustry>("Industry", IndustrySchema.schema);
export = schema;
