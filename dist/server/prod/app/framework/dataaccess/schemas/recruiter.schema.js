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
                        isJobPostClosed: {
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
                        jobCloseReason: {
                            type: String
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQStLQSxDQUFDO0lBOUtDLHNCQUFXLHlCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCwyQkFBMkIsRUFBRTtvQkFDM0IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELG1CQUFtQixFQUFFO29CQUNuQixJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFVBQVUsRUFBRSxDQUFDO3dCQUNYLFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsT0FBTzs0QkFDYixPQUFPLEVBQUUsS0FBSzt5QkFDZjt3QkFDRCx3QkFBd0IsRUFBRTs0QkFDeEIsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsZ0JBQWdCLEVBQUU7NEJBQ2hC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LElBQUksRUFBRSxNQUFNO2lEQUNiLENBQUM7NENBQ0YsSUFBSSxFQUFFLE1BQU07eUNBQ2IsQ0FBQztpQ0FDSCxDQUFDO3lCQUNIO3dCQUNELFlBQVksRUFBRTs0QkFDWixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsV0FBVyxFQUFFOzRCQUNYLElBQUksRUFBRSxJQUFJO3lCQUNYO3dCQUNELFlBQVksRUFBRTs0QkFDWixJQUFJLEVBQUUsSUFBSTt5QkFDWDt3QkFDRCxrQkFBa0IsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO3FCQUNyQyxDQUFDO2FBQ0gsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxzQkFBQztBQUFELENBL0tBLEFBK0tDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWEsV0FBVyxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvcmVjcnVpdGVyLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IElSZWNydWl0ZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS9yZWNydWl0ZXInKTtcclxuXHJcbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgUmVjcnVpdGVyU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIGxldCBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICB1c2VySWQ6IHtcclxuICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1VzZXInXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBhbnlfbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjb21wYW55X3NpemU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY29tcGFueV93ZWJzaXRlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBhbnlfbG9nbzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjb21wYW55X2hlYWRxdWFydGVyX2NvdW50cnk6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgYWJvdXRfY29tcGFueToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBpc1JlY3J1aXRpbmdGb3JzZWxmOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhblxyXG4gICAgICB9LFxyXG4gICAgICBzZXRPZkRvY3VtZW50czoge1xyXG4gICAgICAgIHR5cGU6IFtTdHJpbmddXHJcbiAgICAgIH0sXHJcbiAgICAgIHBvc3RlZEpvYnM6IFt7XHJcbiAgICAgICAgaXNKb2JQb3N0ZWQ6IHtcclxuICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nOiB7XHJcbiAgICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzSm9iUG9zdEV4cGlyZWQ6IHtcclxuICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNKb2JQb3N0Q2xvc2VkOiB7XHJcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzSm9iU2hhcmVkOiB7XHJcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpZGVDb21wYW55TmFtZToge1xyXG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYXBhYmlsaXR5X21hdHJpeDoge1xyXG4gICAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBqb2JDbG9zZVJlYXNvbjp7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmRpZGF0ZV9saXN0OiBbe1xyXG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgaWRzOiBbe1xyXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgIGNpdHk6IFN0cmluZyxcclxuICAgICAgICAgIHN0YXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgICBwaW46IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgam9pbmluZ1BlcmlvZDoge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBqb2JUaXRsZToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaGFyZWRMaW5rOiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhpcmluZ01hbmFnZXI6IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVwYXJ0bWVudDoge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlZHVjYXRpb246IHtcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLypleHBlcmllbmNlOiB7XHJcbiAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgICB9LCovXHJcbiAgICAgICAgZXhwZXJpZW5jZU1pblZhbHVlOiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGV4cGVyaWVuY2VNYXhWYWx1ZToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYWxhcnlNaW5WYWx1ZToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzYWxhcnlNYXhWYWx1ZToge1xyXG4gICAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKnNhbGFyeToge1xyXG4gICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICAgfSwqL1xyXG4gICAgICAgIHByb2ZpY2llbmNpZXM6IHtcclxuICAgICAgICAgIHR5cGU6IFtTdHJpbmddXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRpdGlvbmFsUHJvZmljaWVuY2llczoge1xyXG4gICAgICAgICAgdHlwZTogW1N0cmluZ11cclxuICAgICAgICB9LFxyXG4gICAgICAgIGludGVyZXN0ZWRJbmR1c3RyaWVzOiB7XHJcbiAgICAgICAgICB0eXBlOiBbU3RyaW5nXVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluZHVzdHJ5OiB7XHJcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICByb2xlczogW3tcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgICAgaXNTZWNvbmRhcnk6IEJvb2xlYW5cclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBzY2VuYXJpb3M6IFt7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcGV0ZW5jaWVzOiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc3BvbnNpYmlsaXR5OiB7XHJcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RpbmdEYXRlOiB7XHJcbiAgICAgICAgICB0eXBlOiBEYXRlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHBpcmluZ0RhdGU6IHtcclxuICAgICAgICAgIHR5cGU6IERhdGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbGV2ZW50SW5kdXN0cmllczogW3t0eXBlOiBTdHJpbmd9XVxyXG4gICAgICB9XVxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJUmVjcnVpdGVyPignUmVjcnVpdGVyJywgUmVjcnVpdGVyU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
