import DataAccess = require('../../../framework/dataaccess/dataaccess');
import { Schema } from 'mongoose';
import ItemGst = require('../mongoose/ItemGst');


let mongooseConnection = DataAccess.mongooseConnection;

class ItemGstSchema {
  static get schema() {

    let schema = new Schema({
      itemName : String,
      value : Number,
      type: String
    },{
      versionKey: false,
      timestamps:true
    });
    return schema;
  }
}

let schema = mongooseConnection.model<ItemGst>('ItemGst', ItemGstSchema.schema);
export = schema;
