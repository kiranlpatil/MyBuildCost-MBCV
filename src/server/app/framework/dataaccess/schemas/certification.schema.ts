import DataAccess = require("../dataaccess");
import ICertification = require("../mongoose/certification");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class CertificationSchema {
  static get schema() {
    var schema = mongoose.Schema({
      name: {
        type: String
      },
      remark: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<ICertification>("Certification", CertificationSchema.schema);
export = schema;
