import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var encrypt = require('mongoose-encryption');
var encKey = 'RGV2ZWxvcGVyIGNob2ljZSB0byB1c2Ugd2hpY2ggYmq';
var sigKey ='RGV2ZWxvcGVyIGNob2ljZSB0byB1c2Ugd2hpY2ggYmqRGV2ZWxvcGVyIGNob2ljZSB0byB1c2Ugd2hpY2ggYmq';

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
      }]
    }, {versionKey: false});
    schema.plugin(encrypt, {
      encryptionKey: encKey,
      signingKey: sigKey,
      encryptedFields: ['password']
    });
    return schema;
  }
}
var schema = mongooseConnection.model<User>("User", UserSchema.schema);
export = schema;
