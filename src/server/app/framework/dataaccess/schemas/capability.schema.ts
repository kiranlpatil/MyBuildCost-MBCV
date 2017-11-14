import DataAccess = require("../dataaccess");
import ICapability = require("../mongoose/capability");
import IComplexity = require("../mongoose/complexity");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class CapabilitySchema {
  static get schema() {
    let schema = mongoose.Schema({
      name: {
        type: String
      },
      complexities: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'IComplexity'
      }],

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<ICapability>("Capability", CapabilitySchema.schema);
export = schema;
