import * as mongoose from "mongoose";
import CandidateModel = require("../model/candidate.model");
interface ICandidate extends CandidateModel, mongoose.Document {
}
export = ICandidate;
