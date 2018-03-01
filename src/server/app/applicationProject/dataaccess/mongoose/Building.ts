import * as mongoose from 'mongoose';
import BuildingsModel = require('../model/project/building/Building');
interface Building extends BuildingsModel, mongoose.Document {
  _id:string;
}
export = Building;
