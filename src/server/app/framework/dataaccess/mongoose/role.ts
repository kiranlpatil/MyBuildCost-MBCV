import * as mongoose from "mongoose";
import RoleModel = require("../model/role.model");
interface IRole extends RoleModel, mongoose.Document {
}
export = IRole;
