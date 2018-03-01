import * as mongoose from 'mongoose';
import CompanyModel = require('../model/Company');
interface Company extends CompanyModel, mongoose.Document {
  _id:string;
}
export = Company;
