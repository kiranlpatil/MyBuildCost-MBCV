import * as mongoose from "mongoose";
import RecruiterCandidatesModel = require("../model/recruiter-candidate.model");

interface RecruiterCandidates extends RecruiterCandidatesModel, mongoose.Document {
}
export = RecruiterCandidates;
