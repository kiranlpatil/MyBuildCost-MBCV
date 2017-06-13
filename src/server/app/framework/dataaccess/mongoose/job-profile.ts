import * as mongoose from "mongoose";
import JobProfileModel = require("../model/jobprofile.model");
interface IJobProfile extends JobProfileModel, mongoose.Document {
}
export = IJobProfile;
