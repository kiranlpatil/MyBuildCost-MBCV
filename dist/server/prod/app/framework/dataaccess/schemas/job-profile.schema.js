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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2pvYi1wcm9maWxlLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBVzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBaUZBLENBQUM7SUFoRkMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0Qsc0JBQXNCLEVBQUU7b0JBQ3RCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDaEI7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxDQUFDOzRCQUNOLElBQUksRUFBRSxNQUFNOzRCQUNaLFlBQVksRUFBRSxDQUFDO29DQUNiLFlBQVksRUFBRSxDQUFDOzRDQUNiLFNBQVMsRUFBRTtnREFDVCxTQUFTLEVBQUUsT0FBTztnREFDbEIsSUFBSSxFQUFFLE1BQU07Z0RBQ1osSUFBSSxFQUFFLE1BQU07NkNBQ2I7NENBQ0QsSUFBSSxFQUFFLE1BQU07eUNBQ2IsQ0FBQztvQ0FDRixJQUFJLEVBQUUsTUFBTTtpQ0FDYixDQUFDO3lCQUNILENBQUM7aUJBQ0g7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxvQkFBb0IsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO2FBRXZDLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQWpGQSxBQWlGQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFjLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvam9iLXByb2ZpbGUuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBVc2VyID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3VzZXJcIik7XG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYW5kaWRhdGVcIik7XG5pbXBvcnQgSUNhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FwYWJpbGl0eVwiKTtcbmltcG9ydCBJQWNhZGVtaWMgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvYWNhZGVtaWNzXCIpO1xuaW1wb3J0IElQcm9maWNpZW5jeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9maWNpZW5jeVwiKTtcbmltcG9ydCBJUHJvZmVzc2lvbmFsRGV0YWlscyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlsc1wiKTtcbmltcG9ydCBJRW1wbG95bWVudEhpc3RvcnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvZW1wbG95bWVudC1oaXN0b3J5XCIpO1xuaW1wb3J0IElKb2JQcm9maWxlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2pvYi1wcm9maWxlXCIpO1xuaW1wb3J0IElMb2NhdGlvbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9sb2NhdGlvblwiKTtcbmltcG9ydCBJRG9tYWluID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2RvbWFpblwiKTtcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgSm9iUHJvZmlsZVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xuICAgICAgam9iVGl0bGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgc2hhcmVkTGluazoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBoaXJpbmdNYW5hZ2VyOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGRlcGFydG1lbnQ6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgZWR1Y2F0aW9uOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGV4cGVyaWVuY2U6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgc2FsYXJ5OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIHByb2ZpY2llbmNpZXM6IHtcbiAgICAgICAgbmFtZXM6IFtTdHJpbmddXG4gICAgICB9LFxuICAgICAgbWFuZGF0b3J5UHJvZmljaWVuY2llczoge1xuICAgICAgICBuYW1lczogW1N0cmluZ11cbiAgICAgIH0sXG4gICAgICBpbmR1c3RyeToge1xuICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgIHJvbGVzOiBbe1xuICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XG4gICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XG4gICAgICAgICAgICAgIHNjZW5hcmlvczoge1xuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcbiAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmdcbiAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIGNvbXBldGVuY2llczoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBpc0pvYlBvc3RlZDoge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGlzSm9iUG9zdEV4cGlyZWQ6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBpc0pvYlBvc3RDbG9zZWQ6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBpc0pvYlNoYXJlZDoge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHJlc3BvbnNpYmlsaXR5OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIHBvc3RpbmdEYXRlOiB7XG4gICAgICAgIHR5cGU6IERhdGVcbiAgICAgIH0sXG4gICAgICBkYXlzUmVtYWluaW5nRm9yRXhwaXJpbmc6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyXG4gICAgICB9LFxuICAgICAgaW50ZXJlc3RlZEluZHVzdHJpZXM6IFt7dHlwZTogU3RyaW5nfV1cblxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xuXG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxufVxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJSm9iUHJvZmlsZT4oXCJKb2JQcm9maWxlXCIsIEpvYlByb2ZpbGVTY2hlbWEuc2NoZW1hKTtcbmV4cG9ydCA9IHNjaGVtYTtcbiJdfQ==
