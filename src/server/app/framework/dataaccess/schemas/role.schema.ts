import DataAccess = require("../dataaccess");
import IRole = require("../mongoose/role");
import ICapability = require("../mongoose/capability");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class RoleSchema {
  static get schema() {
    let schema = mongoose.Schema({
      name: {
        type: String
      },
      capabilities: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'ICapability'
      }]

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IRole>("Role", RoleSchema.schema);
export = schema;
