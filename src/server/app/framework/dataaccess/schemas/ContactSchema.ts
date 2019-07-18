import { Schema } from 'mongoose';
import IAddPoolCar = require('../mongoose/ContactUs');
import DataAccess = require('./../dataAccess');

const mongoose = DataAccess.mongooseInstance;
const mongooseConnection = DataAccess.mongooseConnection;

class ContactSchema {
    static get schema() {

        const user = new Schema({
            emailId: {
                    type: String
                },
            contactNumber: {
                    type:Number
                },
            companyName: {
                    type: String
                },
            type: {
                    type: String
                },
            },
            {
                timestamps: true,
                versionKey: false
            });
        return user;
    }
}
const ContactUsSchema = mongooseConnection.model<IAddPoolCar>('AddPoolCar', ContactSchema.schema);
export = ContactUsSchema;
