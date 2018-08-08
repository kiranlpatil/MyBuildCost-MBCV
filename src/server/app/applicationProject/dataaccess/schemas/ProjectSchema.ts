import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Project = require('../mongoose/Project');
import Building = require('../mongoose/Building');
import { Schema } from 'mongoose';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;


class ProjectSchema {
  static get schema() {

    let schema = new Schema({

      name: {
        type: String,
        required: true
      },
      activeStatus: {
        type: Boolean
      },
      region: {
        type: String
      },
      buildings: [{type: Schema.Types.ObjectId, ref: 'Building'}],
      address: {
        city: String,
        state: String,
        country: String,
        pin: String
      },
      plotArea: {
        type: Number
      },
        slabArea: {
        type: Number
      },
        podiumArea: {
        type: Number
      },
        openSpace: {
        type: Number
      },
        poolCapacity: {
        type: Number
      },
        totalNumOfBuildings: {
        type: Number
      },
      plotPeriphery: {
        type: Number
      },
      projectCostHeads: [{}],
      rates: [{}],
      projectDuration: {
        type: Number
      },
      activation_date: {
        type: Date,
      },
        projectImage: {
          type: String
        }
    },
      {
        versionKey: false,
        timestamps:true
      });
    return schema;
  }
}
let schema = mongooseConnection.model<Project>('Project', ProjectSchema.schema);
export = schema;
