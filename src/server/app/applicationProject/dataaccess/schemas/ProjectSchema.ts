import DataAccess = require('../../../framework/dataaccess/dataaccess');
import Project = require('../mongoose/Project');
import Building = require('../mongoose/Building');
import { Schema } from 'mongoose';

let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;


class ProjectSchema {
  static get schema() {

    let schema = mongoose.Schema({

      name: {
        type: String
      },
      region: {
        type: String
      },
      building: [{type: Schema.Types.ObjectId, ref: 'Building'}],
      address: {
        city: String,
        state: String,
        country: String,
        pin: String
      },
      plotArea: {
        type: Number
      },
      plotPeriphery: {
        type: Number
      },
      projectDuration: {
        type: Number
      },
      activation_date: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: new Date()
      },
      modifiedAt: {
        type: Date,
        default: new Date()
      }
    }, {versionKey: false});
    return schema;
  }
}
let schema = mongooseConnection.model<Project>('Project', ProjectSchema.schema);
export = schema;
