import * as mongoose from "mongoose";
import RecruiterCandidatesModel = require("../model/recruiter-candidate.model");

interface RecruiterCandidates extends mongoose.Document {
  recruiterId: String;
  candidateId: String;
  mobileNumber: Number;
  status: String;
  noOfMatchingJobs: Number;
  source: String;
  statusUpdatedOn: Date;
}
export = RecruiterCandidates;
