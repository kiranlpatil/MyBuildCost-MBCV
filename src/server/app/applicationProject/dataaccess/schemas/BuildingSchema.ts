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
      totalCarpetAreaOfUnit: {
        type: Number
      },
        totalSaleableAreaOfUnit: {
        type: Number
      },
        plinthArea:{
        type: Number
      },
        totalNumOfFloors:{
        type: Number
      },
        numOfParkingFloors:{
        type: Number
      },
        carpetAreaOfParking:{
        type: Number
      },
      numOfOneBHK: {
        type: Number
      },
      numOfTwoBHK: {
        type: Number
      },
      numOfThreeBHK: {
        type: Number
      },
        numOfFourBHK: {
        type: Number
      },
        numOfFiveBHK: {
        type: Number
      },
        numOfLifts: {
        type: Number
      },
      costHeads: [{}],
      rates: [{}],
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
