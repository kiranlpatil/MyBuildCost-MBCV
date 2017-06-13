import DataAccess = require("../dataaccess");
import IRole = require("../mongoose/role");
import ICapability = require("../mongoose/capability");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class RoleSchema {
  static get schema() {
    var schema = mongoose.Schema({
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
var schema = mongooseConnection.model<IRole>("Role", RoleSchema.schema);
export = schema;
