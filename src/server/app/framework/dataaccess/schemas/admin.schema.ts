import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import IRecruiter = require("../mongoose/recruiter");
import IAdmin = require("../mongoose/admin");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class AdminSchema {
  static get schema() {
    var schema = mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      }
    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IAdmin>("Role", AdminSchema.schema);
export = schema;
