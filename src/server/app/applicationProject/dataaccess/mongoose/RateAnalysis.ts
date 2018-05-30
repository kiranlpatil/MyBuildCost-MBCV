import * as mongoose from 'mongoose';
import RateAnalysisModel = require('../model/RateAnalysis/RateAnalysis');
interface RateAnalysis extends RateAnalysisModel, mongoose.Document {
  _id:string;
}
export = RateAnalysis;
