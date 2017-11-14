import DataAccess = require("../dataaccess");
import ShareLink = require("../mongoose/share-link");
let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class ShareLinkSchema {
  static get schema() {
    let schema = mongoose.Schema({
      shortUrl: {
        type: String,
        unique: true
      },
      longUrl: {
        type: String
      },
      isJobPosted: {
        type: Boolean,
        default: false
      },
    }, {versionKey: false});
    return schema;
  }
}
let schema = mongooseConnection.model<ShareLink>('ShareLink', ShareLinkSchema.schema);
export = schema;
