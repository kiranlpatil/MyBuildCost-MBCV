import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class IndustrySchema {
    static get schema() {
        var schema = mongoose.Schema({
          code_name : {
            type : String
          },
          name : {
            type: String
          },
          sort_order:Number,
          roles : [{
            name:String,
            capabilities : [{
              complexities:[{
                scenarios:[{
                  name:String,
                  code: String
                }],
                name: String
              }],
              name : String
            }]
          }],
          proficiencies : {
            label : String,
            names : [String]
          }

        },{ versionKey: false });

        return schema;
    }
}
var schema = mongooseConnection.model<IIndustry>("Industry", IndustrySchema.schema);
export = schema;
