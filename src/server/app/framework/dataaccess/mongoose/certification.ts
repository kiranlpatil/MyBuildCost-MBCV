import * as mongoose from "mongoose";
import CertificationModel = require("../model/certification.model");
interface ICertification extends CertificationModel, mongoose.Document {
}
export = ICertification;
