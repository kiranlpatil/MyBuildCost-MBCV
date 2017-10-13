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
                isJobPostClosed: {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2pvYi1wcm9maWxlLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBVzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBaUZBLENBQUM7SUFoRkMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxDQUFDOzRCQUNOLElBQUksRUFBRSxNQUFNOzRCQUNaLFlBQVksRUFBRSxDQUFDO29DQUNiLFlBQVksRUFBRSxDQUFDOzRDQUNiLFNBQVMsRUFBRTtnREFDVCxTQUFTLEVBQUUsT0FBTztnREFDbEIsSUFBSSxFQUFFLE1BQU07Z0RBQ1osSUFBSSxFQUFFLE1BQU07NkNBQ2I7NENBQ0QsSUFBSSxFQUFFLE1BQU07eUNBQ2IsQ0FBQztvQ0FDRixJQUFJLEVBQUUsTUFBTTtpQ0FDYixDQUFDO3lCQUNILENBQUM7aUJBQ0g7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxvQkFBb0IsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO2FBRXZDLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQWpGQSxBQWlGQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFjLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvam9iLXByb2ZpbGUuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvdXNlclwiKTtcclxuaW1wb3J0IElDYW5kaWRhdGUgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FuZGlkYXRlXCIpO1xyXG5pbXBvcnQgSUNhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FwYWJpbGl0eVwiKTtcclxuaW1wb3J0IElBY2FkZW1pYyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9hY2FkZW1pY3NcIik7XHJcbmltcG9ydCBJUHJvZmljaWVuY3kgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvcHJvZmljaWVuY3lcIik7XHJcbmltcG9ydCBJUHJvZmVzc2lvbmFsRGV0YWlscyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlsc1wiKTtcclxuaW1wb3J0IElFbXBsb3ltZW50SGlzdG9yeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9lbXBsb3ltZW50LWhpc3RvcnlcIik7XHJcbmltcG9ydCBJSm9iUHJvZmlsZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9qb2ItcHJvZmlsZVwiKTtcclxuaW1wb3J0IElMb2NhdGlvbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9sb2NhdGlvblwiKTtcclxuaW1wb3J0IElEb21haW4gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvZG9tYWluXCIpO1xyXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIEpvYlByb2ZpbGVTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgIGpvYlRpdGxlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHNoYXJlZExpbms6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgaGlyaW5nTWFuYWdlcjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBkZXBhcnRtZW50OiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGVkdWNhdGlvbjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBleHBlcmllbmNlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHNhbGFyeToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBwcm9maWNpZW5jaWVzOiB7XHJcbiAgICAgICAgbmFtZXM6IFtTdHJpbmddXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmRhdG9yeVByb2ZpY2llbmNpZXM6IHtcclxuICAgICAgICBuYW1lczogW1N0cmluZ11cclxuICAgICAgfSxcclxuICAgICAgaW5kdXN0cnk6IHtcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgcm9sZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XHJcbiAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgICBzY2VuYXJpb3M6IHtcclxuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfSxcclxuICAgICAgY29tcGV0ZW5jaWVzOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzSm9iUG9zdGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc0pvYlBvc3RFeHBpcmVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc0pvYlBvc3RDbG9zZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzSm9iU2hhcmVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICByZXNwb25zaWJpbGl0eToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBwb3N0aW5nRGF0ZToge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgICAgfSxcclxuICAgICAgZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIGludGVyZXN0ZWRJbmR1c3RyaWVzOiBbe3R5cGU6IFN0cmluZ31dXHJcblxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJSm9iUHJvZmlsZT4oXCJKb2JQcm9maWxlXCIsIEpvYlByb2ZpbGVTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
