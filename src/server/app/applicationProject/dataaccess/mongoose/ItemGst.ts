import * as mongoose from 'mongoose';
import ItemGstModel = require('../model/RateAnalysis/ItemGst');


interface ItemGst extends ItemGstModel, mongoose.Document {
  _id: String;
}

export = ItemGst;
