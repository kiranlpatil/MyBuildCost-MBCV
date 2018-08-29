import DataAccess = require('../dataaccess');
import User = require('../mongoose/user');
import Project = require('../../../applicationProject/dataaccess/model/project/Project');
import { Schema } from 'mongoose';
let mongoose = DataAccess.mongooseInstance;
let mongooseConnection = DataAccess.mongooseConnection;


class UserSchema {
  static get schema() {
    let schema = new Schema({

     /* location: {
        city: String,
        state: String,
        country: String,
        pin: String
      },*/
      first_name: {
        type: String
      },
      state: {
        type: String
      },
      city: {
        type: String
      },
      company_name: {
        type: String
      },
      last_name: {
        type: String
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      mobile_number: {
        type: Number,
        required: false
      },
      temp_mobile: {
        type: Number,
        default: 0
      },
      temp_email: {
        type: String
      },
      password: {
        type: String
      },
      isActivated: {
        type: Boolean,
        default: false
      },
      otp: {
        type: Number,
        default: 0
      },

      picture: {
        type: String,
        required: false
      },
      isCandidate: {
        type: Boolean
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      social_profile_picture: {
        type: String,
        required: false
      },
      current_theme: {
        type: String,
        required: false
      },
      notifications: [{
        image: String,
        title: String,
        description: String,
        is_read: Boolean,
        notification_time: Date
      }],
      guide_tour: [{type: String}],
      activation_date: {
        type: Date,
      },
      created_date: {
        type: Date,
        default: new Date()
      },
      project : [{type: Schema.Types.ObjectId, ref: 'Project'}],
      subscription: {
        type: Object
      },
      typeOfApp: {
        type: String
      },
      subscriptionForRA: {
        type: Object
      },
    }, {versionKey: false});
    return schema;
  }
}
let schema = mongooseConnection.model<User>('User', UserSchema.schema);
export = schema;
