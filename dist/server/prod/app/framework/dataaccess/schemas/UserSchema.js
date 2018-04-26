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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL1VzZXJTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUc3QyxxQ0FBa0M7QUFDbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUE4RkEsQ0FBQztJQTdGQyxzQkFBVyxvQkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBUTNCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxJQUFJO29CQUNkLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUUsS0FBSztpQkFDaEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSxDQUFDO2lCQUNYO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELEdBQUcsRUFBRTtvQkFDSCxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFFRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7aUJBQ2hCO2dCQUNELGFBQWEsRUFBRSxDQUFDO3dCQUNkLEtBQUssRUFBRSxNQUFNO3dCQUNiLEtBQUssRUFBRSxNQUFNO3dCQUNiLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixPQUFPLEVBQUUsT0FBTzt3QkFDaEIsaUJBQWlCLEVBQUUsSUFBSTtxQkFDeEIsQ0FBQztnQkFDRixVQUFVLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztnQkFDNUIsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsSUFBSTtvQkFDVixPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUU7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLGlCQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDLENBQUM7Z0JBQ3pELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsaUJBQUM7QUFBRCxDQTlGQSxBQThGQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFPLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkUsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL1VzZXJTY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9Qcm9qZWN0Jyk7XHJcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcclxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG5sZXQgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5cclxuY2xhc3MgVXNlclNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICBsZXQgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuXHJcbiAgICAgLyogbG9jYXRpb246IHtcclxuICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgfSwqL1xyXG4gICAgICBmaXJzdF9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0YXRlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNpdHk6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY29tcGFueV9uYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RfbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBlbWFpbDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICB1bmlxdWU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbW9iaWxlX251bWJlcjoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgdGVtcF9tb2JpbGU6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDogMFxyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wX2VtYWlsOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzQWN0aXZhdGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBvdHA6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDogMFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGljdHVyZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXNDYW5kaWRhdGU6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzQWRtaW46IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHNvY2lhbF9wcm9maWxlX3BpY3R1cmU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRfdGhlbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIG5vdGlmaWNhdGlvbnM6IFt7XHJcbiAgICAgICAgaW1hZ2U6IFN0cmluZyxcclxuICAgICAgICB0aXRsZTogU3RyaW5nLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBTdHJpbmcsXHJcbiAgICAgICAgaXNfcmVhZDogQm9vbGVhbixcclxuICAgICAgICBub3RpZmljYXRpb25fdGltZTogRGF0ZVxyXG4gICAgICB9XSxcclxuICAgICAgZ3VpZGVfdG91cjogW3t0eXBlOiBTdHJpbmd9XSxcclxuICAgICAgYWN0aXZhdGlvbl9kYXRlOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgfSxcclxuICAgICAgY3JlYXRlZF9kYXRlOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICBkZWZhdWx0OiBuZXcgRGF0ZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2plY3QgOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnUHJvamVjdCd9XSxcclxuICAgICAgc3Vic2NyaXB0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICAgIH1cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxVc2VyPignVXNlcicsIFVzZXJTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
