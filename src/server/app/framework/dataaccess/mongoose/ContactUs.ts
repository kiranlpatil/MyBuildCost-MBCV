import * as mongoose from 'mongoose';
import Contact = require('../model/ContactModel');

interface IAddPoolCar extends Contact, mongoose.Document {
    _id: string;
}
export = IAddPoolCar;
