import * as mongoose from "mongoose";
import AdminModel = require("../model/admin.model");
interface IAdmin extends AdminModel, mongoose.Document {
}
export = IAdmin;
