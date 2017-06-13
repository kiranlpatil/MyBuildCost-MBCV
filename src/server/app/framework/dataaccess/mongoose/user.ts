import * as mongoose from "mongoose";
import UserModel = require("../model/user.model");
interface User extends UserModel, mongoose.Document {
}
export = User;
