import * as mongoose from "mongoose";
import ProfessionalDetailsModel = require("../model/professional-details.model");
interface IProfessionalDetails extends ProfessionalDetailsModel, mongoose.Document {
}
export = IProfessionalDetails;
