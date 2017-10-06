"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var RecruiterSchema = (function () {
    function RecruiterSchema() {
    }
    Object.defineProperty(RecruiterSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                userId: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'User'
                },
                company_name: {
                    type: String
                },
                company_size: {
                    type: String
                },
                company_website: {
                    type: String
                },
                company_logo: {
                    type: String
                },
                company_headquarter_country: {
                    type: String
                },
                about_company: {
                    type: String
                },
                isRecruitingForself: {
                    type: Boolean
                },
                setOfDocuments: {
                    type: [String]
                },
                postedJobs: [{
                        isJobPosted: {
                            type: Boolean,
                            default: false
                        },
                        daysRemainingForExpiring: {
                            type: Number
                        },
                        isJobPostExpired: {
                            type: Boolean,
                            default: false
                        },
                        isJobShared: {
                            type: Boolean,
                            default: false
                        },
                        hideCompanyName: {
                            type: Boolean,
                            default: false
                        },
                        capability_matrix: {
                            type: Object
                        },
                        candidate_list: [{
                                name: String,
                                ids: [{
                                        type: String
                                    }]
                            }],
                        location: {
                            city: String,
                            state: String,
                            country: String,
                            pin: String
                        },
                        joiningPeriod: {
                            type: String
                        },
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
                        experienceMinValue: {
                            type: String
                        },
                        experienceMaxValue: {
                            type: String
                        },
                        salaryMinValue: {
                            type: String
                        },
                        salaryMaxValue: {
                            type: String
                        },
                        proficiencies: {
                            type: [String]
                        },
                        additionalProficiencies: {
                            type: [String]
                        },
                        interestedIndustries: {
                            type: [String]
                        },
                        industry: {
                            name: String,
                            code: String,
                            roles: [{
                                    code: String,
                                    name: String,
                                    sort_order: Number,
                                    capabilities: [{
                                            code: String,
                                            sort_order: Number,
                                            complexities: [{
                                                    code: String,
                                                    sort_order: Number,
                                                    scenarios: [{
                                                            name: String,
                                                            isChecked: Boolean,
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
                                                            name: String,
                                                            isChecked: Boolean,
                                                            code: String
                                                        }],
                                                    name: String
                                                }],
                                            name: String
                                        }]
                                }]
                        },
                        competencies: {
                            type: String
                        },
                        responsibility: {
                            type: String
                        },
                        postingDate: {
                            type: Date
                        },
                        expiringDate: {
                            type: Date
                        },
                        releventIndustries: [{ type: String }]
                    }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return RecruiterSchema;
}());
var schema = mongooseConnection.model('Recruiter', RecruiterSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXdLQSxDQUFDO0lBdktDLHNCQUFXLHlCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCwyQkFBMkIsRUFBRTtvQkFDM0IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELG1CQUFtQixFQUFFO29CQUNuQixJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFVBQVUsRUFBRSxDQUFDO3dCQUNYLFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsT0FBTzs0QkFDYixPQUFPLEVBQUUsS0FBSzt5QkFDZjt3QkFDRCx3QkFBd0IsRUFBRTs0QkFDeEIsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsZ0JBQWdCLEVBQUU7NEJBQ2hC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LE1BQU07eUJBQ2I7d0JBQ0QsY0FBYyxFQUFFOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsSUFBSTt5QkFDWDt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osSUFBSSxFQUFFLElBQUk7eUJBQ1g7d0JBQ0Qsa0JBQWtCLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztxQkFDckMsQ0FBQzthQUNILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsc0JBQUM7QUFBRCxDQXhLQSxBQXdLQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFhLFdBQVcsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBJUmVjcnVpdGVyID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvcmVjcnVpdGVyJyk7XHJcblxyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIFJlY3J1aXRlclNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICBsZXQgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgdXNlcklkOiB7XHJcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdVc2VyJ1xyXG4gICAgICB9LFxyXG4gICAgICBjb21wYW55X25hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY29tcGFueV9zaXplOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBhbnlfd2Vic2l0ZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjb21wYW55X2xvZ286IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY29tcGFueV9oZWFkcXVhcnRlcl9jb3VudHJ5OiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGFib3V0X2NvbXBhbnk6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgaXNSZWNydWl0aW5nRm9yc2VsZjoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW5cclxuICAgICAgfSxcclxuICAgICAgc2V0T2ZEb2N1bWVudHM6IHtcclxuICAgICAgICB0eXBlOiBbU3RyaW5nXVxyXG4gICAgICB9LFxyXG4gICAgICBwb3N0ZWRKb2JzOiBbe1xyXG4gICAgICAgIGlzSm9iUG9zdGVkOiB7XHJcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRheXNSZW1haW5pbmdGb3JFeHBpcmluZzoge1xyXG4gICAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0pvYlBvc3RFeHBpcmVkOiB7XHJcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzSm9iU2hhcmVkOiB7XHJcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpZGVDb21wYW55TmFtZToge1xyXG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYXBhYmlsaXR5X21hdHJpeDoge1xyXG4gICAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5kaWRhdGVfbGlzdDogW3tcclxuICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgIGlkczogW3tcclxuICAgICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgICBzdGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgY291bnRyeTogU3RyaW5nLFxyXG4gICAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGpvaW5pbmdQZXJpb2Q6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgam9iVGl0bGU6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hhcmVkTGluazoge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBoaXJpbmdNYW5hZ2VyOiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlcGFydG1lbnQ6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWR1Y2F0aW9uOiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qZXhwZXJpZW5jZToge1xyXG4gICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICAgfSwqL1xyXG4gICAgICAgIGV4cGVyaWVuY2VNaW5WYWx1ZToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHBlcmllbmNlTWF4VmFsdWU6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2FsYXJ5TWluVmFsdWU6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2FsYXJ5TWF4VmFsdWU6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLypzYWxhcnk6IHtcclxuICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgIH0sKi9cclxuICAgICAgICBwcm9maWNpZW5jaWVzOiB7XHJcbiAgICAgICAgICB0eXBlOiBbU3RyaW5nXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYWRkaXRpb25hbFByb2ZpY2llbmNpZXM6IHtcclxuICAgICAgICAgIHR5cGU6IFtTdHJpbmddXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbnRlcmVzdGVkSW5kdXN0cmllczoge1xyXG4gICAgICAgICAgdHlwZTogW1N0cmluZ11cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbmR1c3RyeToge1xyXG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgcm9sZXM6IFt7XHJcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICAgIGNhcGFiaWxpdGllczogW3tcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcclxuICAgICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICBpc0NoZWNrZWQ6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgaXNQcmltYXJ5OiBCb29sZWFuLFxyXG4gICAgICAgICAgICAgIGlzU2Vjb25kYXJ5OiBCb29sZWFuXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBldGVuY2llczoge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNwb25zaWJpbGl0eToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0aW5nRGF0ZToge1xyXG4gICAgICAgICAgdHlwZTogRGF0ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXhwaXJpbmdEYXRlOiB7XHJcbiAgICAgICAgICB0eXBlOiBEYXRlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWxldmVudEluZHVzdHJpZXM6IFt7dHlwZTogU3RyaW5nfV1cclxuICAgICAgfV1cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG5cclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVJlY3J1aXRlcj4oJ1JlY3J1aXRlcicsIFJlY3J1aXRlclNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
