import DataAccess = require("../dataaccess");
import IAcademic = require("../mongoose/academics");
import ICompany = require("../mongoose/company");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class CompanySchema {
  static get schema() {
    var schema = mongoose.Schema({
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
var schema = mongooseConnection.model<ICompany>("Location", CompanySchema.schema);
export = schema;
