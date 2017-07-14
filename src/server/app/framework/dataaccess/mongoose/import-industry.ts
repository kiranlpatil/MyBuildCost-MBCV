import * as mongoose from "mongoose";
import ImportIndustryModel = require("../model/industry-class.model");
interface IImportIndustry extends ImportIndustryModel, mongoose.Document {
}
export = IImportIndustry;
