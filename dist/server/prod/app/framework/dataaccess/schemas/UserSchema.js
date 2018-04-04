"use strict";
var DataAccess = require("../dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var UserSchema = (function () {
    function UserSchema() {
    }
    Object.defineProperty(UserSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
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
                guide_tour: [{ type: String }],
                activation_date: {
                    type: Date,
                },
                created_date: {
                    type: Date,
                    default: new Date()
                },
                project: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' }]
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL1VzZXJTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUc3QyxxQ0FBa0M7QUFDbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUEyRkEsQ0FBQztJQTFGQyxzQkFBVyxvQkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBUTNCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxJQUFJO29CQUNkLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUUsS0FBSztpQkFDaEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxDQUFDO2lCQUNYO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFFRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELGFBQWEsRUFBRSxDQUFDO3dCQUNkLEtBQUssRUFBRSxNQUFNO3dCQUNiLEtBQUssRUFBRSxNQUFNO3dCQUNiLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixPQUFPLEVBQUUsT0FBTzt3QkFDaEIsaUJBQWlCLEVBQUUsSUFBSTtxQkFDeEIsQ0FBQztnQkFDRixVQUFVLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztnQkFDNUIsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsSUFBSTtvQkFDVixPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUU7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLGlCQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDLENBQUM7YUFDMUQsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxpQkFBQztBQUFELENBM0ZBLEFBMkZDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQU8sTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RSxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvVXNlclNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFByb2plY3QgPSByZXF1aXJlKCcuLi8uLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1Byb2plY3QnKTtcclxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcblxyXG5jbGFzcyBVc2VyU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIGxldCBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG5cclxuICAgICAvKiBsb2NhdGlvbjoge1xyXG4gICAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgICBzdGF0ZTogU3RyaW5nLFxyXG4gICAgICAgIGNvdW50cnk6IFN0cmluZyxcclxuICAgICAgICBwaW46IFN0cmluZ1xyXG4gICAgICB9LCovXHJcbiAgICAgIGZpcnN0X25hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgc3RhdGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY2l0eToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjb21wYW55X25hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgbGFzdF9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgIHVuaXF1ZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBtb2JpbGVfbnVtYmVyOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wX21vYmlsZToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICBkZWZhdWx0OiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBfZW1haWw6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgaXNBY3RpdmF0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIG90cDoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICBkZWZhdWx0OiAwXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwaWN0dXJlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc0NhbmRpZGF0ZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW5cclxuICAgICAgfSxcclxuICAgICAgaXNBZG1pbjoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgc29jaWFsX3Byb2ZpbGVfcGljdHVyZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgY3VycmVudF90aGVtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgbm90aWZpY2F0aW9uczogW3tcclxuICAgICAgICBpbWFnZTogU3RyaW5nLFxyXG4gICAgICAgIHRpdGxlOiBTdHJpbmcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFN0cmluZyxcclxuICAgICAgICBpc19yZWFkOiBCb29sZWFuLFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbl90aW1lOiBEYXRlXHJcbiAgICAgIH1dLFxyXG4gICAgICBndWlkZV90b3VyOiBbe3R5cGU6IFN0cmluZ31dLFxyXG4gICAgICBhY3RpdmF0aW9uX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9LFxyXG4gICAgICBjcmVhdGVkX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICAgIGRlZmF1bHQ6IG5ldyBEYXRlKClcclxuICAgICAgfSxcclxuICAgICAgcHJvamVjdCA6IFt7dHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdQcm9qZWN0J31dXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8VXNlcj4oJ1VzZXInLCBVc2VyU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
