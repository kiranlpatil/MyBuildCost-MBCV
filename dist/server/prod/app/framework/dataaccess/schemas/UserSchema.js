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
            var schema = new mongoose_1.Schema({
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
                project: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' }],
                subscription: {
                    type: Object
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL1VzZXJTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUc3QyxxQ0FBa0M7QUFDbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUE4RkEsQ0FBQztJQTdGQyxzQkFBVyxvQkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztnQkFRdEIsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7b0JBQ2QsTUFBTSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE1BQU07b0JBQ1osT0FBTyxFQUFFLENBQUM7aUJBQ1g7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsR0FBRyxFQUFFO29CQUNILElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxDQUFDO2lCQUNYO2dCQUVELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUUsS0FBSztpQkFDaEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO2lCQUNkO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxzQkFBc0IsRUFBRTtvQkFDdEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUUsS0FBSztpQkFDaEI7Z0JBQ0QsYUFBYSxFQUFFLENBQUM7d0JBQ2QsS0FBSyxFQUFFLE1BQU07d0JBQ2IsS0FBSyxFQUFFLE1BQU07d0JBQ2IsV0FBVyxFQUFFLE1BQU07d0JBQ25CLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixpQkFBaUIsRUFBRSxJQUFJO3FCQUN4QixDQUFDO2dCQUNGLFVBQVUsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO2dCQUM1QixlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRTtpQkFDcEI7Z0JBQ0QsT0FBTyxFQUFHLENBQUMsRUFBQyxJQUFJLEVBQUUsaUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQztnQkFDekQsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBQ0YsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxpQkFBQztBQUFELENBOUZBLEFBOEZDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQU8sTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RSxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvVXNlclNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFByb2plY3QgPSByZXF1aXJlKCcuLi8uLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1Byb2plY3QnKTtcclxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcblxyXG5jbGFzcyBVc2VyU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIGxldCBzY2hlbWEgPSBuZXcgU2NoZW1hKHtcclxuXHJcbiAgICAgLyogbG9jYXRpb246IHtcclxuICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgfSwqL1xyXG4gICAgICBmaXJzdF9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0YXRlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNpdHk6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY29tcGFueV9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RfbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBlbWFpbDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICB1bmlxdWU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbW9iaWxlX251bWJlcjoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgdGVtcF9tb2JpbGU6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDogMFxyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wX2VtYWlsOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzQWN0aXZhdGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBvdHA6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDogMFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGljdHVyZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXNDYW5kaWRhdGU6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzQWRtaW46IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHNvY2lhbF9wcm9maWxlX3BpY3R1cmU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRfdGhlbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFt7XHJcbiAgICAgICAgaW1hZ2U6IFN0cmluZyxcclxuICAgICAgICB0aXRsZTogU3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBTdHJpbmcsXHJcbiAgICAgICAgaXNfcmVhZDogQm9vbGVhbixcclxuICAgICAgICBub3RpZmljYXRpb25fdGltZTogRGF0ZVxyXG4gICAgICB9XSxcclxuICAgICAgZ3VpZGVfdG91cjogW3t0eXBlOiBTdHJpbmd9XSxcclxuICAgICAgYWN0aXZhdGlvbl9kYXRlOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgfSxcclxuICAgICAgY3JlYXRlZF9kYXRlOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICBkZWZhdWx0OiBuZXcgRGF0ZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2plY3QgOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnUHJvamVjdCd9XSxcclxuICAgICAgc3Vic2NyaXB0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICAgIH1cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxVc2VyPignVXNlcicsIFVzZXJTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
