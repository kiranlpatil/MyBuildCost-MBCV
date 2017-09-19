import * as mongoose from "mongoose";
import ShareLinkModel = require("../model/share-link.model");
interface ShareLink extends ShareLinkModel, mongoose.Document {
}
export = ShareLink;
