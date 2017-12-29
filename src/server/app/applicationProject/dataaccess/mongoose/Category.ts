import * as mongoose from 'mongoose';
import CategoryModel = require('../model/Category');
interface Category extends CategoryModel, mongoose.Document {
}
export = Category;
