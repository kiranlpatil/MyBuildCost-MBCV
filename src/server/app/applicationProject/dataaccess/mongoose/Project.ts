import * as mongoose from 'mongoose';
import ProjectModel = require('../model/project/Project');
interface Project extends ProjectModel, mongoose.Document {
  _id:string;
}
export = Project;
