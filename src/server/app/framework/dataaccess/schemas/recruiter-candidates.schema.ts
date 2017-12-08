import DataAccess = require("../dataaccess");
import RecruiterCandidates = require("../mongoose/recruiter-candidates");
let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class RecruiterCandidatesSchema {
  static get schema() {
    let schema = mongoose.Schema({
      recruiterId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter',
        required: true
      },
      candidateId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Candidate'
      },
      mobileNumber: {
        type: Number
      },
      status: {
        type: String
      },
      noOfMatchingJobs: {
        type: Number
      },
      source: {
        type: String,
        required: true
      },
      statusUpdatedOn: {
        type: Date
      }
    }, {versionKey: false});
    return schema;
  }
}

let schema = mongooseConnection.model<RecruiterCandidates>('recruiter-candidates', RecruiterCandidatesSchema.schema);
export = schema;
