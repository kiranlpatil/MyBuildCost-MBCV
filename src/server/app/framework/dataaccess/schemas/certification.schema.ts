import DataAccess = require("../dataaccess");
import ICertification = require("../mongoose/certification");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class CertificationSchema {
  static get schema() {
    let schema = mongoose.Schema({
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
let schema = mongooseConnection.model<ICertification>("Certification", CertificationSchema.schema);
export = schema;
