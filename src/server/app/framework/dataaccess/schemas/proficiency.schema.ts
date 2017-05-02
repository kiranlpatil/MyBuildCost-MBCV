import DataAccess = require("../dataaccess");
import IProficiency = require("../mongoose/proficiency");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ProficiencySchema {
    static get schema() {
        var schema = mongoose.Schema({
          names :{
            type: [String]
          }
        },{ versionKey: false });

        return schema;
    }
}
var schema = mongooseConnection.model<IProficiency>("Proficiency", ProficiencySchema.schema);
export = schema;
