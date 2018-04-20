import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Subscription = require('../mongoose/Subscription');
import BaseSubscriptionPackage = require('../model/project/Subscription/BaseSubscriptionPackage');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class SubscriptionSchema {
  static get schema() {

    let schema = mongoose.Schema({

        basePackage: {
        type: Object
      },
        addBuilding: {
        type: Object
      },
        renewal: {
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
