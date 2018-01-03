import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Building = require('../mongoose/Building');
import Category = require('../mongoose/Category');

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
      totalSalebleAreaOfUnit: {
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
      category: [{}],
      activation_date: {
        type: Date,
      },
      modifiedAt: {
        type: Date,
        default: new Date()
      }
    }, {versionKey: false});
    return schema;
  }
}
let schema = mongooseConnection.model<Building>('Building', BuildingSchema.schema);
export = schema;
