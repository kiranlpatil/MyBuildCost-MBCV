import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Building = require('../mongoose/Building');
import Category = require('../mongoose/CostHead');

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;

class BuildingSchema {
  static get schema() {

    let schema = mongoose.Schema({

      name: {
        type: String
      },
      totalSlabArea: {
        type: Number
      },
      totalCarperAreaOfUnit: {
        type: Number
      },
        totalSaleableAreaOfUnit: {
        type: Number
      },
      totalParkingAreaOfUnit:{
        type: Number
      },
      noOfOneBHK: {
        type: Number
      },
      noOfTwoBHK: {
        type: Number
      },
      noOfThreeBHK: {
        type: Number
      },
      noOfSlab: {
        type: Number
      },
      noOfLift: {
        type: Number
      },
      costHead: [{}],
      activation_date: {
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
let schema = mongooseConnection.model<Building>('Building', BuildingSchema.schema);
export = schema;
