"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var JobProfileSchema = (function () {
    function JobProfileSchema() {
    }
    Object.defineProperty(JobProfileSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                jobTitle: {
                    type: String
                },
                sharedLink: {
                    type: String
                },
                hiringManager: {
                    type: String
                },
                department: {
                    type: String
                },
                education: {
                    type: String
                },
                experience: {
                    type: String
                },
                salary: {
                    type: String
                },
                proficiencies: {
                    names: [String]
                },
                mandatoryProficiencies: {
                    names: [String]
                },
                industry: {
                    name: String,
                    roles: [{
                            name: String,
                            capabilities: [{
                                    complexities: [{
                                            scenarios: {
                                                isChecked: Boolean,
                                                name: String,
                                                code: String
                                            },
                                            name: String
                                        }],
                                    name: String
                                }]
                        }]
                },
                competencies: {
                    type: String
                },
                isJobPosted: {
                    type: Boolean,
                    default: false
                },
                isJobPostExpired: {
                    type: Boolean,
                    default: false
                },
                isJobShared: {
                    type: Boolean,
                    default: false
                },
                responsibility: {
                    type: String
                },
                postingDate: {
                    type: Date
                },
                daysRemainingForExpiring: {
                    type: Number
                },
                interestedIndustries: [{ type: String }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return JobProfileSchema;
}());
var schema = mongooseConnection.model("JobProfile", JobProfileSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2pvYi1wcm9maWxlLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBVzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBNkVBLENBQUM7SUE1RUMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxDQUFDOzRCQUNOLElBQUksRUFBRSxNQUFNOzRCQUNaLFlBQVksRUFBRSxDQUFDO29DQUNiLFlBQVksRUFBRSxDQUFDOzRDQUNiLFNBQVMsRUFBRTtnREFDVCxTQUFTLEVBQUUsT0FBTztnREFDbEIsSUFBSSxFQUFFLE1BQU07Z0RBQ1osSUFBSSxFQUFFLE1BQU07NkNBQ2I7NENBQ0QsSUFBSSxFQUFFLE1BQU07eUNBQ2IsQ0FBQztvQ0FDRixJQUFJLEVBQUUsTUFBTTtpQ0FDYixDQUFDO3lCQUNILENBQUM7aUJBQ0g7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELGNBQWMsRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0Qsd0JBQXdCLEVBQUU7b0JBQ3hCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELG9CQUFvQixFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7YUFFdkMsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCx1QkFBQztBQUFELENBN0VBLEFBNkVDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFGLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9qb2ItcHJvZmlsZS5zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzXCIpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS91c2VyXCIpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYW5kaWRhdGVcIik7XHJcbmltcG9ydCBJQ2FwYWJpbGl0eSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYXBhYmlsaXR5XCIpO1xyXG5pbXBvcnQgSUFjYWRlbWljID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2FjYWRlbWljc1wiKTtcclxuaW1wb3J0IElQcm9maWNpZW5jeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9maWNpZW5jeVwiKTtcclxuaW1wb3J0IElQcm9mZXNzaW9uYWxEZXRhaWxzID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3Byb2Zlc3Npb25hbC1kZXRhaWxzXCIpO1xyXG5pbXBvcnQgSUVtcGxveW1lbnRIaXN0b3J5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2VtcGxveW1lbnQtaGlzdG9yeVwiKTtcclxuaW1wb3J0IElKb2JQcm9maWxlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2pvYi1wcm9maWxlXCIpO1xyXG5pbXBvcnQgSUxvY2F0aW9uID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2xvY2F0aW9uXCIpO1xyXG5pbXBvcnQgSURvbWFpbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9kb21haW5cIik7XHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgSm9iUHJvZmlsZVNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICB2YXIgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgam9iVGl0bGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgc2hhcmVkTGluazoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBoaXJpbmdNYW5hZ2VyOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlcGFydG1lbnQ6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgZWR1Y2F0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGV4cGVyaWVuY2U6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgc2FsYXJ5OiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2ZpY2llbmNpZXM6IHtcclxuICAgICAgICBuYW1lczogW1N0cmluZ11cclxuICAgICAgfSxcclxuICAgICAgbWFuZGF0b3J5UHJvZmljaWVuY2llczoge1xyXG4gICAgICAgIG5hbWVzOiBbU3RyaW5nXVxyXG4gICAgICB9LFxyXG4gICAgICBpbmR1c3RyeToge1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICByb2xlczogW3tcclxuICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgIGNhcGFiaWxpdGllczogW3tcclxuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgIHNjZW5hcmlvczoge1xyXG4gICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9XVxyXG4gICAgICB9LFxyXG4gICAgICBjb21wZXRlbmNpZXM6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgaXNKb2JQb3N0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzSm9iUG9zdEV4cGlyZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzSm9iU2hhcmVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICByZXNwb25zaWJpbGl0eToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBwb3N0aW5nRGF0ZToge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgICAgfSxcclxuICAgICAgZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyZXN0ZWRJbmR1c3RyaWVzOiBbe3R5cGU6IFN0cmluZ31dXHJcblxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJSm9iUHJvZmlsZT4oXCJKb2JQcm9maWxlXCIsIEpvYlByb2ZpbGVTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
