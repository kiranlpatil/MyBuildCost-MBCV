import IComplexity = require("../mongoose/complexity");
import * as mongoose from "mongoose";
import ComplexityModel = require("./complexity.model");

interface DefaultComplexityModel {
    complexities:  ComplexityModel[];
    name : string;
}
export = DefaultComplexityModel;
