import DataAccess = require("../dataaccess");
import ICapability = require("../mongoose/capability");
import IComplexity = require("../mongoose/complexity");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class CapabilitySchema {
  static get schema() {
    var schema = mongoose.Schema({
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
var schema = mongooseConnection.model<ICapability>("Capability", CapabilitySchema.schema);
export = schema;
