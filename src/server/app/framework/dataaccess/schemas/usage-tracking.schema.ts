import DataAccess = require('../dataaccess');
import UsageTrackingModel = require('../mongoose/usage-tracking.interface');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class UsageTrackingSchema {

  static get schema() {
    let schema = mongoose.Schema({
      recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      jobProfileId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      action: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date
      }
    }, {versionKey: false});

    return schema;
  }

}
let schema: any = mongooseConnection.model<UsageTrackingModel>("UsesTracking", UsageTrackingSchema.schema);
export = schema;
