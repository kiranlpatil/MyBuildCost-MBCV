import DataAccess = require('../dataaccess');
import IAcademic = require('../mongoose/academics');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class AcademicSchema {
  static get schema() {
    let schema = mongoose.Schema({
      schoolName: {
        type: String
      },
      board: {
        type: String
      },
      yearOfPassing: {
        type: String
      },
      specialization: {
        type: String
      }

    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IAcademic>('Academic', AcademicSchema.schema);
export = schema;
