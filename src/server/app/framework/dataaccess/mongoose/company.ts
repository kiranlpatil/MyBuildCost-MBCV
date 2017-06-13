import * as mongoose from "mongoose";
import CompanyModel = require("../model/company.model");
interface ICompany extends CompanyModel, mongoose.Document {
}
export = ICompany;
