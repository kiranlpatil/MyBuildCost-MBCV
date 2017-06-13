import * as mongoose from "mongoose";
import RecruiterModel = require("../model/recruiter.model");
interface IRecruiter extends RecruiterModel, mongoose.Document {
}
export = IRecruiter;
