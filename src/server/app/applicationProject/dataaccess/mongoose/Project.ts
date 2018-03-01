import * as mongoose from 'mongoose';
import ProjectModel = require('../model/Project');
interface Project extends ProjectModel, mongoose.Document {
  _id:string;
}
export = Project;
