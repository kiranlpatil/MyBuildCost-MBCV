import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");
import IProfessionalDetails = require("../mongoose/professional-details");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ProfessionalDetailsSchema {
  static get schema() {
    var schema = mongoose.Schema({
      relocate: {
        type: String
      },
      education: {
        type: String
      },
      currentSalary: {
        type: String
      },
      experience: {
        type: String
      },
      noticePeriod: {
        type: String
      }
    }, {versionKey: false});

    return schema;
  }
}
var schema = mongooseConnection.model<IProfessionalDetails>("ProfessionalDetails", ProfessionalDetailsSchema.schema);
export = schema;
