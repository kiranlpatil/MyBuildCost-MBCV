import * as mongoose from 'mongoose';
import SubscriptionModel = require('../model/company/Subscription');
interface Subscription extends SubscriptionModel, mongoose.Document {
  _id:string;
}
export = Subscription;
