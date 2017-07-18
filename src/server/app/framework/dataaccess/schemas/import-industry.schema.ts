/**
 * Created by techprime002 on 7/11/2017.
 */
import DataAccess = require("../dataaccess");
import ImportIndustryModel = require("../model/industry-class.model");
import IImportIndustry = require("../mongoose/import-industry");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ImportIndustrySchema {
  static get schema() {
    var schema = mongoose.Schema({
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
      capabilities: {
        type: String
      },
      industry: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IImportIndustry>("ImportIndustry", ImportIndustrySchema.schema);
export = schema;
