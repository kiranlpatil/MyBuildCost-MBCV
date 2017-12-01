import DataAccess = require('../dataaccess');
import User = require('../mongoose/user');
import IRecruiter = require('../mongoose/recruiter');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class RecruiterSchema {
  static get schema() {
    let schema = mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      company_name: {
        type: String
      },
      company_size: {
        type: String
      },
      company_website: {
        type: String
      },
      company_logo: {
        type: String
      },
      company_headquarter_country: {
        type: String
      },
      about_company: {
        type: String
      },
      isRecruitingForself: {
        type: Boolean
      },
      setOfDocuments: {
        type: [String]
      },
      postedJobs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'JobProfile'
      }],
      my_candidate_list: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Candidates'
      }],
      api_key: String
    }, {versionKey: false});

    return schema;
  }
}
let schema = mongooseConnection.model<IRecruiter>('Recruiter', RecruiterSchema.schema);
export = schema;
