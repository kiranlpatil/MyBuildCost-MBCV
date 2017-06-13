import * as mongoose from "mongoose";
import IndustryModel = require("../model/industry.model");
interface IIndustry extends IndustryModel, mongoose.Document {
}
export = IIndustry;
