import * as mongoose from "mongoose";
import LocationModel = require("../model/location.model");
interface ILocation extends LocationModel, mongoose.Document {
}
export = ILocation;
