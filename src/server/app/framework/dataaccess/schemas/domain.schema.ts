import DataAccess = require("../dataaccess");
import IScenario = require("../mongoose/scenario");
import IRole = require("../mongoose/role");
import IIndustry = require("../mongoose/industry");
import IDomain = require("../mongoose/domain");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class DomainSchema {
  static get schema() {
    let schema = mongoose.Schema({
      name: {
        type: String
      },
      roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'IRole'}]

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IDomain>("Domain", DomainSchema.schema);
export = schema;
