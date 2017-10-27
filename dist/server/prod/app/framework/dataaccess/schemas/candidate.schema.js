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
                complexity_note_matrix: {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUU3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DO0lBQUE7SUFtSkEsQ0FBQztJQWxKQyxzQkFBVyx5QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBRTVCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxpQkFBaUIsRUFBRztvQkFDbEIsSUFBSSxFQUFHLE1BQU07aUJBQ2Q7Z0JBQ0Qsc0JBQXNCLEVBQUc7b0JBQ3ZCLElBQUksRUFBRyxNQUFNO2lCQUNkO2dCQUNELGNBQWMsRUFBRSxDQUFDO3dCQUNmLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFB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LENBQUM7aUJBQ2Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELFFBQVEsRUFBRSxDQUFDO3dCQUNULElBQUksRUFBRSxNQUFNO3dCQUNaLEdBQUcsRUFBRSxDQUFDO2dDQUNKLElBQUksRUFBRSxNQUFNOzZCQUNiLENBQUM7cUJBQ0gsQ0FBQzthQUVILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsc0JBQUM7QUFBRCxDQW5KQSxBQW1KQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFhLFdBQVcsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IElDYW5kaWRhdGUgPSByZXF1aXJlKCcuLi9tb25nb29zZS9jYW5kaWRhdGUnKTtcclxudmFyIG1vbmdvb3NlMSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG52YXIgbW9uZ29vc2UgPSByZXF1aXJlKCdtb25nb29zZScpO1xyXG5cclxuY2xhc3MgQ2FuZGlkYXRlU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZTEuU2NoZW1hKHtcclxuXHJcbiAgICAgIGpvYlRpdGxlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvbGVUeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHVzZXJJZDoge1xyXG4gICAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcidcclxuICAgICAgfSxcclxuICAgICAgaXNDb21wbGV0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzU3VibWl0dGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc1Zpc2libGU6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgYWJvdXRNeXNlbGY6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY2FwYWJpbGl0eV9tYXRyaXggOiB7XHJcbiAgICAgICAgdHlwZSA6IE9iamVjdFxyXG4gICAgICB9LFxyXG4gICAgICBjb21wbGV4aXR5X25vdGVfbWF0cml4IDoge1xyXG4gICAgICAgIHR5cGUgOiBPYmplY3RcclxuICAgICAgfSxcclxuICAgICAgY2VydGlmaWNhdGlvbnM6IFt7XHJcbiAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgIHllYXI6IE51bWJlcixcclxuICAgICAgICBpc3N1ZWRCeTogU3RyaW5nLFxyXG4gICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICByZW1hcms6IFN0cmluZ1xyXG4gICAgICB9XSxcclxuICAgICAgaW50ZXJlc3RlZEluZHVzdHJpZXM6IHtcclxuICAgICAgICB0eXBlOiBbU3RyaW5nXVxyXG4gICAgICB9LFxyXG4gICAgICBhd2FyZHM6IFt7XHJcbiAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgIHllYXI6IE51bWJlcixcclxuICAgICAgICBpc3N1ZWRCeTogU3RyaW5nLFxyXG4gICAgICAgIHJlbWFyazogU3RyaW5nXHJcbiAgICAgIH1dLFxyXG4gICAgICBpbmR1c3RyeToge1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgcm9sZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XHJcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgICBzY2VuYXJpb3M6IFt7XHJcbiAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgaXNQcmltYXJ5OiBCb29sZWFuLFxyXG4gICAgICAgICAgICBpc1NlY29uZGFyeTogQm9vbGVhblxyXG4gICAgICAgICAgfV0sXHJcbiAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcclxuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0sXHJcbiAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgY2l0eTogU3RyaW5nLFxyXG4gICAgICAgIHN0YXRlOiBTdHJpbmcsXHJcbiAgICAgICAgY291bnRyeTogU3RyaW5nLFxyXG4gICAgICAgIHBpbjogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGFjYWRlbWljczogW3tcclxuICAgICAgICBzY2hvb2xOYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgYm9hcmQ6IFN0cmluZyxcclxuICAgICAgICB5ZWFyT2ZQYXNzaW5nOiBOdW1iZXIsXHJcbiAgICAgICAgc3BlY2lhbGl6YXRpb246IFN0cmluZ1xyXG4gICAgICB9XSxcclxuICAgICAgcHJvZmVzc2lvbmFsRGV0YWlsczoge1xyXG4gICAgICAgIGVkdWNhdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIGV4cGVyaWVuY2U6IFN0cmluZyxcclxuICAgICAgICBjdXJyZW50U2FsYXJ5OiBTdHJpbmcsXHJcbiAgICAgICAgbm90aWNlUGVyaW9kOiBTdHJpbmcsXHJcbiAgICAgICAgcmVsb2NhdGU6IFN0cmluZyxcclxuICAgICAgICBpbmR1c3RyeUV4cG9zdXJlOiBTdHJpbmcsXHJcbiAgICAgICAgY3VycmVudENvbXBhbnk6IFN0cmluZyxcclxuICAgICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgICAgY2l0eTogU3RyaW5nLFxyXG4gICAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICAgIGNvdW50cnk6IFN0cmluZyxcclxuICAgICAgICAgIHBpbjogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgZW1wbG95bWVudEhpc3Rvcnk6IFt7XHJcbiAgICAgICAgY29tcGFueU5hbWU6IFN0cmluZyxcclxuICAgICAgICBkZXNpZ25hdGlvbjogU3RyaW5nLFxyXG4gICAgICAgIGlzUHJlc2VudGx5V29ya2luZzogQm9vbGVhbixcclxuICAgICAgICBmcm9tOiB7XHJcbiAgICAgICAgICBtb250aDogU3RyaW5nLFxyXG4gICAgICAgICAgeWVhcjogTnVtYmVyXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0bzoge1xyXG4gICAgICAgICAgbW9udGg6IFN0cmluZyxcclxuICAgICAgICAgIHllYXI6IE51bWJlclxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtYXJrczogU3RyaW5nXHJcbiAgICAgIH1dLFxyXG4gICAgICBwcm9maWNpZW5jaWVzOiB7XHJcbiAgICAgICAgdHlwZTogW1N0cmluZ11cclxuICAgICAgfSxcclxuICAgICAgbG9ja2VkT246IHtcclxuICAgICAgICB0eXBlOiBEYXRlXHJcbiAgICAgIH0sXHJcbiAgICAgIGpvYl9saXN0OiBbe1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICBpZHM6IFt7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9XVxyXG4gICAgICB9XSxcclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElDYW5kaWRhdGU+KCdDYW5kaWRhdGUnLCBDYW5kaWRhdGVTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
