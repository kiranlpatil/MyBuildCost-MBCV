"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var UserSchema = (function () {
    function UserSchema() {
    }
    Object.defineProperty(UserSchema, "schema", {
        get: function () {
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
                guide_tour: [{ type: String }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return UserSchema;
}());
var schema = mongooseConnection.model('User', UserSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3VzZXIuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFHN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUEwRUEsQ0FBQztJQXpFQyxzQkFBVyxvQkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBRTNCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsTUFBTTtvQkFDYixPQUFPLEVBQUUsTUFBTTtvQkFDZixHQUFHLEVBQUUsTUFBTTtpQkFDWjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUUsSUFBSTtvQkFDZCxNQUFNLEVBQUUsSUFBSTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxDQUFDO2lCQUNYO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFFRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELGFBQWEsRUFBRSxDQUFDO3dCQUNkLEtBQUssRUFBRSxNQUFNO3dCQUNiLEtBQUssRUFBRSxNQUFNO3dCQUNiLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixPQUFPLEVBQUUsT0FBTzt3QkFDaEIsaUJBQWlCLEVBQUUsSUFBSTtxQkFDeEIsQ0FBQztnQkFDRixVQUFVLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQzthQUM3QixFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILGlCQUFDO0FBQUQsQ0ExRUEsQUEwRUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBTyxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZFLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy91c2VyLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcclxuXHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuXHJcbmNsYXNzIFVzZXJTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XHJcblxyXG4gICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgICBzdGF0ZTogU3RyaW5nLFxyXG4gICAgICAgIGNvdW50cnk6IFN0cmluZyxcclxuICAgICAgICBwaW46IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBmaXJzdF9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RfbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBlbWFpbDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICB1bmlxdWU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbW9iaWxlX251bWJlcjoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wX21vYmlsZToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICBkZWZhdWx0OiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBfZW1haWw6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgaXNBY3RpdmF0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIG90cDoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICBkZWZhdWx0OiAwXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwaWN0dXJlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc0NhbmRpZGF0ZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW5cclxuICAgICAgfSxcclxuICAgICAgaXNBZG1pbjoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgc29jaWFsX3Byb2ZpbGVfcGljdHVyZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgY3VycmVudF90aGVtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgbm90aWZpY2F0aW9uczogW3tcclxuICAgICAgICBpbWFnZTogU3RyaW5nLFxyXG4gICAgICAgIHRpdGxlOiBTdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFN0cmluZyxcclxuICAgICAgICBpc19yZWFkOiBCb29sZWFuLFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbl90aW1lOiBEYXRlXHJcbiAgICAgIH1dLFxyXG4gICAgICBndWlkZV90b3VyOiBbe3R5cGU6IFN0cmluZ31dXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8VXNlcj4oJ1VzZXInLCBVc2VyU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
