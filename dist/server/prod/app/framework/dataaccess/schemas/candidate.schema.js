"use strict";
var DataAccess = require("../dataaccess");
var mongoose1 = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var mongoose = require('mongoose');
var CandidateSchema = (function () {
    function CandidateSchema() {
    }
    Object.defineProperty(CandidateSchema, "schema", {
        get: function () {
            var schema = mongoose1.Schema({
                jobTitle: {
                    type: String
                },
                roleType: {
                    type: String
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'User'
                },
                isCompleted: {
                    type: Boolean,
                    default: false
                },
                isSubmitted: {
                    type: Boolean,
                    default: false
                },
                isVisible: {
                    type: Boolean,
                    default: true
                },
                aboutMyself: {
                    type: String
                },
                capability_matrix: {
                    type: Object
                },
                certifications: [{
                        name: String,
                        year: Number,
                        issuedBy: String,
                        code: String,
                        remark: String
                    }],
                interestedIndustries: {
                    type: [String]
                },
                awards: [{
                        name: String,
                        year: Number,
                        issuedBy: String,
                        remark: String
                    }],
                industry: {
                    name: String,
                    code: String,
                    roles: [{
                            name: String,
                            sort_order: Number,
                            code: String,
                            capabilities: [{
                                    code: String,
                                    sort_order: Number,
                                    complexities: [{
                                            code: String,
                                            sort_order: Number,
                                            scenarios: [{
                                                    isChecked: Boolean,
                                                    name: String,
                                                    code: String
                                                }],
                                            name: String
                                        }],
                                    name: String,
                                    isPrimary: Boolean,
                                    isSecondary: Boolean
                                }],
                            default_complexities: [{
                                    code: String,
                                    complexities: [{
                                            code: String,
                                            scenarios: [{
                                                    isChecked: Boolean,
                                                    name: String,
                                                    code: String
                                                }],
                                            name: String
                                        }],
                                    name: String
                                }]
                        }]
                },
                location: {
                    city: String,
                    state: String,
                    country: String,
                    pin: String
                },
                academics: [{
                        schoolName: String,
                        board: String,
                        yearOfPassing: Number,
                        specialization: String
                    }],
                professionalDetails: {
                    education: String,
                    experience: String,
                    currentSalary: String,
                    noticePeriod: String,
                    relocate: String,
                    industryExposure: String,
                    currentCompany: String,
                    location: {
                        city: String,
                        state: String,
                        country: String,
                        pin: String
                    },
                },
                employmentHistory: [{
                        companyName: String,
                        designation: String,
                        from: {
                            month: String,
                            year: Number
                        },
                        to: {
                            month: String,
                            year: Number
                        },
                        remarks: String
                    }],
                proficiencies: {
                    type: [String]
                },
                lockedOn: {
                    type: Date
                },
                job_list: [{
                        name: String,
                        ids: [{
                                type: String
                            }]
                    }],
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return CandidateSchema;
}());
var schema = mongooseConnection.model('Candidate', CandidateSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQWM3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DO0lBQUE7SUErSUEsQ0FBQztJQTlJQyxzQkFBVyx5QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBRTVCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxpQkFBaUIsRUFBRztvQkFDbEIsSUFBSSxFQUFHLE1BQU07aUJBQ2Q7Z0JBQ0QsY0FBYyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLE1BQU07d0JBQ1osUUFBUSxFQUFFLE1BQU07d0JBQ2hCLElBQUksRUFBRSxN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LENBQUM7d0JBQ1QsSUFBSSxFQUFFLE1BQU07d0JBQ1osR0FBRyxFQUFFLENBQUM7Z0NBQ0osSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQztxQkFDSCxDQUFDO2FBRUgsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxzQkFBQztBQUFELENBL0lBLEFBK0lDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWEsV0FBVyxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvY2FuZGlkYXRlLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS91c2VyJyk7XG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2NhbmRpZGF0ZScpO1xuaW1wb3J0IElDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvY2FwYWJpbGl0eScpO1xuaW1wb3J0IElDb21wbGV4aXR5ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvY29tcGxleGl0eScpO1xuaW1wb3J0IElBY2FkZW1pYyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2FjYWRlbWljcycpO1xuaW1wb3J0IElQcm9maWNpZW5jeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3Byb2ZpY2llbmN5Jyk7XG5pbXBvcnQgSVByb2Zlc3Npb25hbERldGFpbHMgPSByZXF1aXJlKCcuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlscycpO1xuaW1wb3J0IElFbXBsb3ltZW50SGlzdG9yeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2VtcGxveW1lbnQtaGlzdG9yeScpO1xuaW1wb3J0IElKb2JQcm9maWxlID0gcmVxdWlyZSgnLi4vbW9uZ29vc2Uvam9iLXByb2ZpbGUnKTtcbmltcG9ydCBJTG9jYXRpb24gPSByZXF1aXJlKCcuLi9tb25nb29zZS9sb2NhdGlvbicpO1xuaW1wb3J0IElSb2xlID0gcmVxdWlyZSgnLi4vbW9uZ29vc2Uvcm9sZScpO1xuaW1wb3J0IElJbmR1c3RyeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2luZHVzdHJ5Jyk7XG5pbXBvcnQgQ2FwYWJpbGl0eU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvY2FwYWJpbGl0eS5tb2RlbCcpO1xudmFyIG1vbmdvb3NlMSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJyk7XG5cbmNsYXNzIENhbmRpZGF0ZVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZTEuU2NoZW1hKHtcblxuICAgICAgam9iVGl0bGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgcm9sZVR5cGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgdXNlcklkOiB7XG4gICAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcidcbiAgICAgIH0sXG4gICAgICBpc0NvbXBsZXRlZDoge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGlzU3VibWl0dGVkOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgaXNWaXNpYmxlOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhYm91dE15c2VsZjoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBjYXBhYmlsaXR5X21hdHJpeCA6IHtcbiAgICAgICAgdHlwZSA6IE9iamVjdFxuICAgICAgfSxcbiAgICAgIGNlcnRpZmljYXRpb25zOiBbe1xuICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgIHllYXI6IE51bWJlcixcbiAgICAgICAgaXNzdWVkQnk6IFN0cmluZyxcbiAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICByZW1hcms6IFN0cmluZ1xuICAgICAgfV0sXG4gICAgICBpbnRlcmVzdGVkSW5kdXN0cmllczoge1xuICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgfSxcbiAgICAgIGF3YXJkczogW3tcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICB5ZWFyOiBOdW1iZXIsXG4gICAgICAgIGlzc3VlZEJ5OiBTdHJpbmcsXG4gICAgICAgIHJlbWFyazogU3RyaW5nXG4gICAgICB9XSxcbiAgICAgIGluZHVzdHJ5OiB7XG4gICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICByb2xlczogW3tcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgICBzY2VuYXJpb3M6IFt7XG4gICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXG4gICAgICAgICAgICBpc1NlY29uZGFyeTogQm9vbGVhblxuICAgICAgICAgIH1dLFxuICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgY2l0eTogU3RyaW5nLFxuICAgICAgICBzdGF0ZTogU3RyaW5nLFxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXG4gICAgICAgIHBpbjogU3RyaW5nXG4gICAgICB9LFxuICAgICAgYWNhZGVtaWNzOiBbe1xuICAgICAgICBzY2hvb2xOYW1lOiBTdHJpbmcsXG4gICAgICAgIGJvYXJkOiBTdHJpbmcsXG4gICAgICAgIHllYXJPZlBhc3Npbmc6IE51bWJlcixcbiAgICAgICAgc3BlY2lhbGl6YXRpb246IFN0cmluZ1xuICAgICAgfV0sXG4gICAgICBwcm9mZXNzaW9uYWxEZXRhaWxzOiB7XG4gICAgICAgIGVkdWNhdGlvbjogU3RyaW5nLFxuICAgICAgICBleHBlcmllbmNlOiBTdHJpbmcsXG4gICAgICAgIGN1cnJlbnRTYWxhcnk6IFN0cmluZyxcbiAgICAgICAgbm90aWNlUGVyaW9kOiBTdHJpbmcsXG4gICAgICAgIHJlbG9jYXRlOiBTdHJpbmcsXG4gICAgICAgIGluZHVzdHJ5RXhwb3N1cmU6IFN0cmluZyxcbiAgICAgICAgY3VycmVudENvbXBhbnk6IFN0cmluZyxcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICBjaXR5OiBTdHJpbmcsXG4gICAgICAgICAgc3RhdGU6IFN0cmluZyxcbiAgICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXG4gICAgICAgICAgcGluOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBlbXBsb3ltZW50SGlzdG9yeTogW3tcbiAgICAgICAgY29tcGFueU5hbWU6IFN0cmluZyxcbiAgICAgICAgZGVzaWduYXRpb246IFN0cmluZyxcbiAgICAgICAgZnJvbToge1xuICAgICAgICAgIG1vbnRoOiBTdHJpbmcsXG4gICAgICAgICAgeWVhcjogTnVtYmVyXG4gICAgICAgIH0sXG4gICAgICAgIHRvOiB7XG4gICAgICAgICAgbW9udGg6IFN0cmluZyxcbiAgICAgICAgICB5ZWFyOiBOdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgcmVtYXJrczogU3RyaW5nXG4gICAgICB9XSxcbiAgICAgIHByb2ZpY2llbmNpZXM6IHtcbiAgICAgICAgdHlwZTogW1N0cmluZ11cbiAgICAgIH0sXG4gICAgICBsb2NrZWRPbjoge1xuICAgICAgICB0eXBlOiBEYXRlXG4gICAgICB9LFxuICAgICAgam9iX2xpc3Q6IFt7XG4gICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgaWRzOiBbe1xuICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9XVxuICAgICAgfV0sXG5cbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cbn1cbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SUNhbmRpZGF0ZT4oJ0NhbmRpZGF0ZScsIENhbmRpZGF0ZVNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
