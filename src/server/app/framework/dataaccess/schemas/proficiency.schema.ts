import DataAccess = require("../dataaccess");
import IProficiency = require("../mongoose/proficiency");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class ProficiencySchema {
  static get schema() {
    let schema = mongoose.Schema({
      /*name :{
       type: String
       },*/
      proficiencies: {
        type: [String]
      }
    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IProficiency>("Proficiency", ProficiencySchema.schema);
export = schema;
