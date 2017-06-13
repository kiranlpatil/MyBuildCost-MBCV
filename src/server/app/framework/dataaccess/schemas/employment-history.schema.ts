import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");
import IProfessionalDetails = require("../mongoose/professional-details");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class EmploymentHistorySchema {
  static get schema() {
    var schema = mongoose.Schema({

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
var schema = mongooseConnection.model<IProfessionalDetails>("EmploymentHistory", EmploymentHistorySchema.schema);
export = schema;
