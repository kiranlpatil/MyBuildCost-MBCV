import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");
import IRecruiter = require("../mongoose/recruiter");
import IAdmin = require("../mongoose/admin");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class AdminSchema {
  static get schema() {
    let schema = mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      }
    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IAdmin>("Role", AdminSchema.schema);
export = schema;
