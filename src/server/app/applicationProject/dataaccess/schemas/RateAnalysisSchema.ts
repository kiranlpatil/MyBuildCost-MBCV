import DataAccess = require('../../../framework/dataaccess/dataaccess');
import RateAnalysis = require('../mongoose/RateAnalysis');
import { Schema } from 'mongoose';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class RateAnalysisSchema {
  static get schema() {

    let schema = new Schema({
        region : String,
        buildingCostHeads: [{}],
        buildingRates: [{}],
        projectCostHeads: [{}],
        projectRates: [{}],
        fixedAmountCostHeads :[{}],
        appType: String
      },
      {
        versionKey: false,
        timestamps:true
      });
    return schema;
  }
}
let schema = mongooseConnection.model<RateAnalysis>('RateAnalysis', RateAnalysisSchema.schema);
export = schema;
