import DataAccess = require("../dataaccess");
import IAcademic = require("../mongoose/academics");
import ICompany = require("../mongoose/company");

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class CompanySchema {
  static get schema() {
    let schema = mongoose.Schema({
      schoolName: {
        type: String
      },
      board: {
        type: String
      },
      yearOfPassing: {
        type: Number
      },
      specialization: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<ICompany>("Location", CompanySchema.schema);
export = schema;
