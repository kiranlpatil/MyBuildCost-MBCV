import * as mongoose from 'mongoose';
import UsageTrackingModel = require('../model/Users/UsageTracking');

interface UsageTracking extends UsageTrackingModel, mongoose.Document {
  _id:string;
}
export = UsageTracking;
