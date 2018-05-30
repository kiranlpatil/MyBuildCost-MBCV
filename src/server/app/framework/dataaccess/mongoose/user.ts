import * as mongoose from 'mongoose';
import UserModel = require('../model/UserModel');
interface User extends UserModel, mongoose.Document {
}
export = User;
