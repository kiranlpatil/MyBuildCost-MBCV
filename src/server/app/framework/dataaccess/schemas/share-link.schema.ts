import DataAccess = require("../dataaccess");
import ShareLink = require("../mongoose/share-link");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class ShareLinkSchema {
  static get schema() {
    var schema = mongoose.Schema({
      shortUrl: {
        type: String,
        unique: true
      },
      longUrl: {
        type: String
      }
    }, {versionKey: false});
    return schema;
  }
}
var schema = mongooseConnection.model<ShareLink>("ShareLink", ShareLinkSchema.schema);
export = schema;
