import * as mongoose from "mongoose";
import AcademicModel = require("../model/academic.model");
interface IAcademic extends AcademicModel, mongoose.Document {
}
export = IAcademic;
