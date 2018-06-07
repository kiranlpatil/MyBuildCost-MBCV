import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Subscription = require('../mongoose/Subscription');
import BaseSubscriptionPackage = require('../model/project/Subscription/BaseSubscriptionPackage');
import {Schema} from 'mongoose';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class SubscriptionSchema {
  static get schema() {

    let schema = new Schema({

        basePackage: {
        type: Object
      },
        addOnPackage: {
        type: Object
      }
    },
      {
        versionKey: false,
        timestamps:true
      });
    return schema;
  }
}
let schema = mongooseConnection.model<Subscription>('Subscription', SubscriptionSchema.schema);
export = schema;
