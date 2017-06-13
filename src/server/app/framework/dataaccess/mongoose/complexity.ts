import * as mongoose from "mongoose";
import ComplexityModel = require("../model/complexity.model");
interface IComplexity extends ComplexityModel, mongoose.Document {
}
export = IComplexity;
