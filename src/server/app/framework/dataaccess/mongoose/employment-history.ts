import * as mongoose from "mongoose";
import EmployeeHistoryModel = require("../model/employee-history.model");
interface IEmploymentHistory extends EmployeeHistoryModel, mongoose.Document {
}
export = IEmploymentHistory;
