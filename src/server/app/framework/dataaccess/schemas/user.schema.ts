import DataAccess = require('../dataaccess');
import User = require('../mongoose/user');

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;


class UserSchema {
  static get schema() {
    var schema = mongoose.Schema({

      location: {
        city: String,
        state: String,
        country: String,
        pin: String
      },
      first_name: {
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
        required: true
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
      guide_tour: [{type: String}]
    }, {versionKey: false});
    return schema;
  }
}
var schema = mongooseConnection.model<User>('User', UserSchema.schema);
export = schema;
