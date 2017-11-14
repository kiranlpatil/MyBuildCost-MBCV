import DataAccess = require("../dataaccess");
import ILocation = require("../mongoose/location");
import IProfessionalDetails = require("../mongoose/professional-details");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class ProfessionalDetailsSchema {
  static get schema() {
    let schema = mongoose.Schema({
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
      },
      industryExposure: {
        type: String
      }
    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IProfessionalDetails>("ProfessionalDetails", ProfessionalDetailsSchema.schema);
export = schema;
