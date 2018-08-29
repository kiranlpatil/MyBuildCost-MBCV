import DataAccess = require('../../../framework/dataaccess/dataaccess');
import UsageTracking = require('../mongoose/UsageTracking');
import { Schema } from 'mongoose';
let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class UsageTrackingSchema {
  static get schema() {

    let schema = new Schema({
        userId: {
          type: String
        },
        deviceId: {
          type: String
        },
        platform: {
          type: String
        },
        browser: {
          type: String
        },
        isMobile: {
          type: Boolean
        },
        isDesktop: {
              type: Boolean
        },
        deviceOS: {
          type: String
        },
        appType: {
          type: String
        },
        mobileNumber: {
          type: Number
        },
        email: {
          type: String
        }
      },
      {
        versionKey: false,
        timestamps:true
      });
    return schema;
  }
}
let schema = mongooseConnection.model<UsageTracking>('UsageTracking', UsageTrackingSchema.schema);
export = schema;
