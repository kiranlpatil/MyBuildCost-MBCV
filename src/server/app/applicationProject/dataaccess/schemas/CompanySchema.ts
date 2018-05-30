import DataAccess = require('../../../framework/dataaccess/dataaccess');
import { Schema } from 'mongoose';
import Company = require('../mongoose/Company');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;


class CompanySchema {
  static get schema() {

    let schema = new Schema({

      name: {
        type: String
      },
      address: {
        type: String
      },
      users: [{type: Schema.Types.ObjectId, ref: 'User'}],
      projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
      subscription: {type: Schema.Types.ObjectId, ref: 'Subscription'},
      dateOfSubscription: {
        type: Date,
      }
    },
     {
       versionKey: false,
       timestamps:true
     });
    return schema;
  }
}
let schema = mongooseConnection.model<Company>('Company', CompanySchema.schema);
export = schema;
