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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUU3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DO0lBQUE7SUFnSkEsQ0FBQztJQS9JQyxzQkFBVyx5QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBRTVCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxpQkFBaUIsRUFBRztvQkFDbEIsSUFBSSxFQUFHLE1BQU07aUJBQ2Q7Z0JBQ0QsY0FBYyxFQUFFLENBQUM7d0JBQ2YsSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLE1BQU07d0JBQ1osUUFBUSxFQUFFLE1BQU07d0JBQ2hCLElBQUksRUFBRSxN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QUk7aUJBQ1g7Z0JBQ0QsUUFBUSxFQUFFLENBQUM7d0JBQ1QsSUFBSSxFQUFFLE1BQU07d0JBQ1osR0FBRyxFQUFFLENBQUM7Z0NBQ0osSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQztxQkFDSCxDQUFDO2FBRUgsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxzQkFBQztBQUFELENBaEpBLEFBZ0pDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWEsV0FBVyxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvY2FuZGlkYXRlLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2NhbmRpZGF0ZScpO1xyXG52YXIgbW9uZ29vc2UxID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoJ21vbmdvb3NlJyk7XHJcblxyXG5jbGFzcyBDYW5kaWRhdGVTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlMS5TY2hlbWEoe1xyXG5cclxuICAgICAgam9iVGl0bGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgcm9sZVR5cGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgdXNlcklkOiB7XHJcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdVc2VyJ1xyXG4gICAgICB9LFxyXG4gICAgICBpc0NvbXBsZXRlZDoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXNTdWJtaXR0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzVmlzaWJsZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBhYm91dE15c2VsZjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjYXBhYmlsaXR5X21hdHJpeCA6IHtcclxuICAgICAgICB0eXBlIDogT2JqZWN0XHJcbiAgICAgIH0sXHJcbiAgICAgIGNlcnRpZmljYXRpb25zOiBbe1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICB5ZWFyOiBOdW1iZXIsXHJcbiAgICAgICAgaXNzdWVkQnk6IFN0cmluZyxcclxuICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVtYXJrOiBTdHJpbmdcclxuICAgICAgfV0sXHJcbiAgICAgIGludGVyZXN0ZWRJbmR1c3RyaWVzOiB7XHJcbiAgICAgICAgdHlwZTogW1N0cmluZ11cclxuICAgICAgfSxcclxuICAgICAgYXdhcmRzOiBbe1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICB5ZWFyOiBOdW1iZXIsXHJcbiAgICAgICAgaXNzdWVkQnk6IFN0cmluZyxcclxuICAgICAgICByZW1hcms6IFN0cmluZ1xyXG4gICAgICB9XSxcclxuICAgICAgaW5kdXN0cnk6IHtcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgIHJvbGVzOiBbe1xyXG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgY2FwYWJpbGl0aWVzOiBbe1xyXG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xyXG4gICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIGlzUHJpbWFyeTogQm9vbGVhbixcclxuICAgICAgICAgICAgaXNTZWNvbmRhcnk6IEJvb2xlYW5cclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgICBzY2VuYXJpb3M6IFt7XHJcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9XVxyXG4gICAgICB9LFxyXG4gICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgICBzdGF0ZTogU3RyaW5nLFxyXG4gICAgICAgIGNvdW50cnk6IFN0cmluZyxcclxuICAgICAgICBwaW46IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBhY2FkZW1pY3M6IFt7XHJcbiAgICAgICAgc2Nob29sTmFtZTogU3RyaW5nLFxyXG4gICAgICAgIGJvYXJkOiBTdHJpbmcsXHJcbiAgICAgICAgeWVhck9mUGFzc2luZzogTnVtYmVyLFxyXG4gICAgICAgIHNwZWNpYWxpemF0aW9uOiBTdHJpbmdcclxuICAgICAgfV0sXHJcbiAgICAgIHByb2Zlc3Npb25hbERldGFpbHM6IHtcclxuICAgICAgICBlZHVjYXRpb246IFN0cmluZyxcclxuICAgICAgICBleHBlcmllbmNlOiBTdHJpbmcsXHJcbiAgICAgICAgY3VycmVudFNhbGFyeTogU3RyaW5nLFxyXG4gICAgICAgIG5vdGljZVBlcmlvZDogU3RyaW5nLFxyXG4gICAgICAgIHJlbG9jYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgaW5kdXN0cnlFeHBvc3VyZTogU3RyaW5nLFxyXG4gICAgICAgIGN1cnJlbnRDb21wYW55OiBTdHJpbmcsXHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgICAgIHN0YXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgICBwaW46IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGVtcGxveW1lbnRIaXN0b3J5OiBbe1xyXG4gICAgICAgIGNvbXBhbnlOYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgZGVzaWduYXRpb246IFN0cmluZyxcclxuICAgICAgICBpc1ByZXNlbnRseVdvcmtpbmc6IEJvb2xlYW4sXHJcbiAgICAgICAgZnJvbToge1xyXG4gICAgICAgICAgbW9udGg6IFN0cmluZyxcclxuICAgICAgICAgIHllYXI6IE51bWJlclxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG86IHtcclxuICAgICAgICAgIG1vbnRoOiBTdHJpbmcsXHJcbiAgICAgICAgICB5ZWFyOiBOdW1iZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbWFya3M6IFN0cmluZ1xyXG4gICAgICB9XSxcclxuICAgICAgcHJvZmljaWVuY2llczoge1xyXG4gICAgICAgIHR5cGU6IFtTdHJpbmddXHJcbiAgICAgIH0sXHJcbiAgICAgIGxvY2tlZE9uOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZVxyXG4gICAgICB9LFxyXG4gICAgICBqb2JfbGlzdDogW3tcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgaWRzOiBbe1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfV1cclxuICAgICAgfV0sXHJcblxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJQ2FuZGlkYXRlPignQ2FuZGlkYXRlJywgQ2FuZGlkYXRlU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
