import DataAccess = require('../../../framework/dataaccess/dataaccess');
import { Schema } from 'mongoose';
import SavedRate = require('../mongoose/SavedRate');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;


class SavedRateSchema {
  static get schema() {

    let schema = new Schema({

        userId: { type: String},
        workItemList : [{}]
      },
      {
        versionKey: false,
        timestamps:true
      });
    return schema;
  }
}
let schema = mongooseConnection.model<SavedRate>('SavedRates', SavedRateSchema.schema);
export = schema;
