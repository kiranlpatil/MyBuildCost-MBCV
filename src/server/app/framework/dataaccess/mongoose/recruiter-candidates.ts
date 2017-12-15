import * as mongoose from "mongoose";
import RecruiterCandidatesModel = require("../model/recruiter-candidate.model");

interface RecruiterCandidates extends mongoose.Document {
  recruiterId: string;
  source: string;
  candidateId: string;
  name: string;
  mobileNumber: number;
  email: string;
  status: string;
  noOfMatchingJobs: number;
  highestMatchingJobPercentage: number;
  jobTitle: string;
  statusUpdatedOn: Date;
}
export = RecruiterCandidates;
