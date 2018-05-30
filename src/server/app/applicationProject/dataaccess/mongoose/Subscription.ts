import * as mongoose from 'mongoose';
import SubscriptionModel = require('../model/project/Subscription/SubscriptionPackage');
interface Subscription extends SubscriptionModel, mongoose.Document {
  _id:string;
}
export = Subscription;
