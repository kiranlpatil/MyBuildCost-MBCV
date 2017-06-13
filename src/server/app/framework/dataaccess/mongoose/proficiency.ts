import * as mongoose from "mongoose";
import ProficiencyModel = require("../model/proficiency.model");
interface IProficiency extends ProficiencyModel, mongoose.Document {
}
export = IProficiency;
