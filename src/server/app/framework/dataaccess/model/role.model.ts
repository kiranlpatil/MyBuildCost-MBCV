import * as mongoose from "mongoose";
import ICapability = require("../mongoose/capability");
import CapabilityModel = require("./capability.model");
import DefaultComplexityModel = require("./default-complexity.model");

interface RoleModel {
    name : string;
    capabilities :CapabilityModel[];
    default_complexities : DefaultComplexityModel[]
}
export = RoleModel;
