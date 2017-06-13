import * as mongoose from "mongoose";
import CapabilityModel = require("../model/capability.model");
interface ICapability extends CapabilityModel, mongoose.Document {
}
export = ICapability;
