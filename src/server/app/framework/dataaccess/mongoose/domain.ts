import * as mongoose from "mongoose";
import DomainModel = require("../model/domain.model");
interface IDomain extends DomainModel, mongoose.Document {
}
export = IDomain;
