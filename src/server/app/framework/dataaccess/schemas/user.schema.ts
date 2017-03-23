import DataAccess = require("../dataaccess");
import User = require("../mongoose/user");

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class UserSchema {
    static get schema() {
        var schema = mongoose.Schema({

            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: true
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
            type: String,
            required: false
          },
            password: {
                type: String,
                required: true
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
            document1: {
                type:Array,
                "default" : [],
                required: false

            },
            document2: {
                type: String,
                required: false
            },
            document3: {
                type: String,
                required: false
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
            image : String,
            title : String,
            description : String,
            is_read : Boolean,
            notification_time : Date
          }]
        },{ versionKey: false });

        return schema;
    }
}
var schema = mongooseConnection.model<User>("User", UserSchema.schema);
export = schema;
