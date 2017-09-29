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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2pvYi1wcm9maWxlLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBVzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBc0VBLENBQUM7SUFyRUMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNoQjtnQkFDRCxzQkFBc0IsRUFBRTtvQkFDdEIsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNoQjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLENBQUM7NEJBQ04sSUFBSSxFQUFFLE1BQU07NEJBQ1osWUFBWSxFQUFFLENBQUM7b0NBQ2IsWUFBWSxFQUFFLENBQUM7NENBQ2IsU0FBUyxFQUFFO2dEQUNULFNBQVMsRUFBRSxPQUFPO2dEQUNsQixJQUFJLEVBQUUsTUFBTTtnREFDWixJQUFJLEVBQUUsTUFBTTs2Q0FDYjs0Q0FDRCxJQUFJLEVBQUUsTUFBTTt5Q0FDYixDQUFDO29DQUNGLElBQUksRUFBRSxNQUFNO2lDQUNiLENBQUM7eUJBQ0gsQ0FBQztpQkFDSDtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxvQkFBb0IsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO2FBRXZDLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQXRFQSxBQXNFQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFjLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvam9iLXByb2ZpbGUuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBVc2VyID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3VzZXJcIik7XG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYW5kaWRhdGVcIik7XG5pbXBvcnQgSUNhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FwYWJpbGl0eVwiKTtcbmltcG9ydCBJQWNhZGVtaWMgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvYWNhZGVtaWNzXCIpO1xuaW1wb3J0IElQcm9maWNpZW5jeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9maWNpZW5jeVwiKTtcbmltcG9ydCBJUHJvZmVzc2lvbmFsRGV0YWlscyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlsc1wiKTtcbmltcG9ydCBJRW1wbG95bWVudEhpc3RvcnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvZW1wbG95bWVudC1oaXN0b3J5XCIpO1xuaW1wb3J0IElKb2JQcm9maWxlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2pvYi1wcm9maWxlXCIpO1xuaW1wb3J0IElMb2NhdGlvbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9sb2NhdGlvblwiKTtcbmltcG9ydCBJRG9tYWluID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2RvbWFpblwiKTtcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgSm9iUHJvZmlsZVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xuICAgICAgam9iVGl0bGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgaGlyaW5nTWFuYWdlcjoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBkZXBhcnRtZW50OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGVkdWNhdGlvbjoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBleHBlcmllbmNlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIHNhbGFyeToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBwcm9maWNpZW5jaWVzOiB7XG4gICAgICAgIG5hbWVzOiBbU3RyaW5nXVxuICAgICAgfSxcbiAgICAgIG1hbmRhdG9yeVByb2ZpY2llbmNpZXM6IHtcbiAgICAgICAgbmFtZXM6IFtTdHJpbmddXG4gICAgICB9LFxuICAgICAgaW5kdXN0cnk6IHtcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICByb2xlczogW3tcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgY2FwYWJpbGl0aWVzOiBbe1xuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgICBzY2VuYXJpb3M6IHtcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgfV1cbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICBjb21wZXRlbmNpZXM6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgaXNKb2JQb3N0ZWQ6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBpc0pvYlBvc3RFeHBpcmVkOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgcmVzcG9uc2liaWxpdHk6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgcG9zdGluZ0RhdGU6IHtcbiAgICAgICAgdHlwZTogRGF0ZVxuICAgICAgfSxcbiAgICAgIGRheXNSZW1haW5pbmdGb3JFeHBpcmluZzoge1xuICAgICAgICB0eXBlOiBOdW1iZXJcbiAgICAgIH0sXG4gICAgICBpbnRlcmVzdGVkSW5kdXN0cmllczogW3t0eXBlOiBTdHJpbmd9XVxuXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG59XG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElKb2JQcm9maWxlPihcIkpvYlByb2ZpbGVcIiwgSm9iUHJvZmlsZVNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
