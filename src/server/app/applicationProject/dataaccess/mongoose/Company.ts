import * as mongoose from 'mongoose';
import CompanyModel = require('../model/company/Company');
interface Company extends CompanyModel, mongoose.Document {
  _id:string;
}
export = Company;
