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
                lastUpdateAt: {
                    type: Date
                },
                aboutMyself: {
                    type: String
                },
                capability_matrix: {
                    type: Object
                },
                complexity_note_matrix: {
                    type: Object
                },
                profile_update_tracking: {
                    type: Number,
                    default: -1
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
                        isPresentlyWorking: Boolean,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUU3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DO0lBQUE7SUEwSkEsQ0FBQztJQXpKQyxzQkFBVyx5QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBRTVCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUMsSUFBSTtpQkFDVjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsaUJBQWlCLEVBQUc7b0JBQ2xCLElBQUksRUFBRyxNQUFNO2lCQUNkO2dCQUNELHNCQUFzQixFQUFHO29CQUN2QixJQUFJLEVBQUcsTUFBTTtpQkFDZDtnQkFDRCx1QkFBdUIs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QUFLLEVBQUUsTUFBTTs0QkFDYixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxPQUFPLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQztnQkFDRixhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSTtpQkFDWDtnQkFDRCxRQUFRLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsTUFBTTt3QkFDWixHQUFHLEVBQUUsQ0FBQztnQ0FDSixJQUFJLEVBQUUsTUFBTTs2QkFDYixDQUFDO3FCQUNILENBQUM7YUFFSCxFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHNCQUFDO0FBQUQsQ0ExSkEsQUEwSkMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYSxXQUFXLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZGLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9jYW5kaWRhdGUuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzJyk7XG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2NhbmRpZGF0ZScpO1xudmFyIG1vbmdvb3NlMSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJyk7XG5cbmNsYXNzIENhbmRpZGF0ZVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZTEuU2NoZW1hKHtcblxuICAgICAgam9iVGl0bGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgcm9sZVR5cGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgdXNlcklkOiB7XG4gICAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcidcbiAgICAgIH0sXG4gICAgICBpc0NvbXBsZXRlZDoge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGlzU3VibWl0dGVkOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgaXNWaXNpYmxlOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBsYXN0VXBkYXRlQXQ6IHtcbiAgICAgICAgdHlwZTpEYXRlXG4gICAgICB9LFxuICAgICAgYWJvdXRNeXNlbGY6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgY2FwYWJpbGl0eV9tYXRyaXggOiB7XG4gICAgICAgIHR5cGUgOiBPYmplY3RcbiAgICAgIH0sXG4gICAgICBjb21wbGV4aXR5X25vdGVfbWF0cml4IDoge1xuICAgICAgICB0eXBlIDogT2JqZWN0XG4gICAgICB9LFxuICAgICAgcHJvZmlsZV91cGRhdGVfdHJhY2tpbmcgOiB7XG4gICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgZGVmYXVsdDotMVxuICAgICAgfSxcbiAgICAgIGNlcnRpZmljYXRpb25zOiBbe1xuICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgIHllYXI6IE51bWJlcixcbiAgICAgICAgaXNzdWVkQnk6IFN0cmluZyxcbiAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICByZW1hcms6IFN0cmluZ1xuICAgICAgfV0sXG4gICAgICBpbnRlcmVzdGVkSW5kdXN0cmllczoge1xuICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgfSxcbiAgICAgIGF3YXJkczogW3tcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICB5ZWFyOiBOdW1iZXIsXG4gICAgICAgIGlzc3VlZEJ5OiBTdHJpbmcsXG4gICAgICAgIHJlbWFyazogU3RyaW5nXG4gICAgICB9XSxcbiAgICAgIGluZHVzdHJ5OiB7XG4gICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICByb2xlczogW3tcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgICBzY2VuYXJpb3M6IFt7XG4gICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXG4gICAgICAgICAgICBpc1NlY29uZGFyeTogQm9vbGVhblxuICAgICAgICAgIH1dLFxuICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgIH1dXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgY2l0eTogU3RyaW5nLFxuICAgICAgICBzdGF0ZTogU3RyaW5nLFxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXG4gICAgICAgIHBpbjogU3RyaW5nXG4gICAgICB9LFxuICAgICAgYWNhZGVtaWNzOiBbe1xuICAgICAgICBzY2hvb2xOYW1lOiBTdHJpbmcsXG4gICAgICAgIGJvYXJkOiBTdHJpbmcsXG4gICAgICAgIHllYXJPZlBhc3Npbmc6IE51bWJlcixcbiAgICAgICAgc3BlY2lhbGl6YXRpb246IFN0cmluZ1xuICAgICAgfV0sXG4gICAgICBwcm9mZXNzaW9uYWxEZXRhaWxzOiB7XG4gICAgICAgIGVkdWNhdGlvbjogU3RyaW5nLFxuICAgICAgICBleHBlcmllbmNlOiBTdHJpbmcsXG4gICAgICAgIGN1cnJlbnRTYWxhcnk6IFN0cmluZyxcbiAgICAgICAgbm90aWNlUGVyaW9kOiBTdHJpbmcsXG4gICAgICAgIHJlbG9jYXRlOiBTdHJpbmcsXG4gICAgICAgIGluZHVzdHJ5RXhwb3N1cmU6IFN0cmluZyxcbiAgICAgICAgY3VycmVudENvbXBhbnk6IFN0cmluZyxcbiAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICBjaXR5OiBTdHJpbmcsXG4gICAgICAgICAgc3RhdGU6IFN0cmluZyxcbiAgICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXG4gICAgICAgICAgcGluOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBlbXBsb3ltZW50SGlzdG9yeTogW3tcbiAgICAgICAgY29tcGFueU5hbWU6IFN0cmluZyxcbiAgICAgICAgZGVzaWduYXRpb246IFN0cmluZyxcbiAgICAgICAgaXNQcmVzZW50bHlXb3JraW5nOiBCb29sZWFuLFxuICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgbW9udGg6IFN0cmluZyxcbiAgICAgICAgICB5ZWFyOiBOdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgdG86IHtcbiAgICAgICAgICBtb250aDogU3RyaW5nLFxuICAgICAgICAgIHllYXI6IE51bWJlclxuICAgICAgICB9LFxuICAgICAgICByZW1hcmtzOiBTdHJpbmdcbiAgICAgIH1dLFxuICAgICAgcHJvZmljaWVuY2llczoge1xuICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgfSxcbiAgICAgIGxvY2tlZE9uOiB7XG4gICAgICAgIHR5cGU6IERhdGVcbiAgICAgIH0sXG4gICAgICBqb2JfbGlzdDogW3tcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICBpZHM6IFt7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH1dXG4gICAgICB9XSxcblxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xuXG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxufVxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJQ2FuZGlkYXRlPignQ2FuZGlkYXRlJywgQ2FuZGlkYXRlU2NoZW1hLnNjaGVtYSk7XG5leHBvcnQgPSBzY2hlbWE7XG4iXX0=
