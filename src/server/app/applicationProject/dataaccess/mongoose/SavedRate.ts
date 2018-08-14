import * as mongoose from 'mongoose';
import RASavedRate = require('../model/RateAnalysis/RASavedRate');

interface SavedRate extends RASavedRate, mongoose.Document {
  _id:string;
}
export = SavedRate;
