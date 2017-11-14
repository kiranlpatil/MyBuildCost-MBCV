import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");
import IProfessionalDetails = require("../mongoose/professional-details");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class EmploymentHistorySchema {
  static get schema() {
    let schema = mongoose.Schema({

      companyName: {
        type: String
      },
      designation: {
        type: String
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      remark: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IProfessionalDetails>("EmploymentHistory", EmploymentHistorySchema.schema);
export = schema;
