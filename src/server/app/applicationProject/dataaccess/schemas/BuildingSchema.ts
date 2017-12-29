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
        quantity: Number,
        unit: String
      },
      totalCarperAreaOfUnit: {
        quantity: Number,
        unit: String
      },
      totalSalebleAreaOfUnit: {
        quantity: Number,
        unit: String
      },
      totalParkingAreaOfUnit:{
        quantity: Number,
        unit: String
      },
      noOftwoBhk: {
        type: Number
      },
      noOfthreeBhk: {
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
