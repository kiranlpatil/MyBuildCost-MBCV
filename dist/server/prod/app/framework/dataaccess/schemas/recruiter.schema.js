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
                        complexity_musthave_matrix: {
                            type: Object
                        },
                        jobCloseReason: {
                            type: Number
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQWtMQSxDQUFDO0lBakxDLHNCQUFXLHlCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCwyQkFBMkIsRUFBRTtvQkFDM0IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELG1CQUFtQixFQUFFO29CQUNuQixJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFVBQVUsRUFBRSxDQUFDO3dCQUNYLFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsT0FBTzs0QkFDYixPQUFPLEVBQUUsS0FBSzt5QkFDZjt3QkFDRCx3QkFBd0IsRUFBRTs0QkFDeEIsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsZ0JBQWdCLEVBQUU7NEJBQ2hCLElBQUksRUFBRSxPQUFPOzRCQUNiLE9BQU8sRUFBRSxLQUFLO3lCQUNmO3dCQUNELGVBQWUsRUFBRTs0QkFDZixJQUFJLEVBQUUsT0FBTzs0QkFDYixPQUFPLEVBQUUsS0FBSzt5QkFDZjt3QkFDRCxXQUFXLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLE9BQU87NEJBQ2IsT0FBTyxFQUFFLEtBQUs7eUJBQ2Y7d0JBQ0QsZUFBZSxFQUFFOzRCQUNmLElBQUksRUFBRSxPQUFPOzRCQUNiLE9BQU8sRUFBRSxLQUFLO3lCQUNmO3dCQUNELGlCQUFpQixFQUFFOzRCQUNqQixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCwwQkFBMEIsRUFBRTs0QkFDMUIsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsY0FBYyxFQUFDOzRCQUNiLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELGNBQWMsRUFBRSxDQUFDO2dDQUNmLElBQUksRUFBRSxNQUFNO2dDQUNaLEdBQUcsRUFBRSxDQUFDO3dDQUNKLElBQUksRUFBRSxNQUFNO3FDQUNiLENBQUM7NkJBQ0gsQ0FBQzt3QkFDRixRQUFRLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLE1BQU07NEJBQ1osS0FBSyxFQUFFLE1BQU07NEJBQ2IsT0FBTyxFQUFFLE1BQU07NEJBQ2YsR0FBRyxFQUFFLE1BQU07eUJBQ1o7d0JBQ0QsYUFBYSxFQUFFOzRCQUNiLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELFFBQVEsRUFBRTs0QkFDUixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxVQUFVLEVBQUU7NEJBQ1YsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsYUFBYSxFQUFFOzRCQUNiLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELFVBQVUsRUFBRTs0QkFDVixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBSUQsa0JBQWtCLEVBQUU7NEJBQ2xCLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELGtCQUFrQixFQUFFOzRCQUNsQixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsY0FBYyxFQUFFOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUlELGFBQWEsRUFBRTs0QkFDYixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7eUJBQ2Y7d0JBQ0QsdUJBQXVCLEVBQUU7NEJBQ3ZCLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQzt5QkFDZjt3QkFDRCxvQkFBb0IsRUFBRTs0QkFDcEIsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO3lCQUNmO3dCQUVELFFBQVEsRUFBRTs0QkFDUixJQUFJLEVBQUUsTUFBTTs0QkFDWixJQUFJLEVBQUUsTUFBTTs0QkFDWixLQUFLLEVBQUUsQ0FBQztvQ0FDTixJQUFJLEVBQUUsTUFBTTtvQ0FDWixJQUFJLEVBQUUsTUFBTTtvQ0FDWixVQUFVLEVBQUUsTUFBTTtvQ0FDbEIsWUFBWSxFQUFFLENBQUM7NENBQ2IsSUFBSSxFQUFFLE1BQU07NENBQ1osVUFBVSxFQUFFLE1BQU07NENBQ2xCLFlBQVksRUFBRSxDQUFDO29EQUNiLElBQUksRUFBRSxNQUFNO29EQUNaLFVBQVUsRUFBRSxNQUFNO29EQUNsQixTQUFTLEVBQUUsQ0FBQzs0REFDVixJQUFJLEVBQUUsTUFBTTs0REFDWixTQUFTLEVBQUUsT0FBTzs0REFDbEIsSUFBSSxFQUFFLE1BQU07eURBQ2IsQ0FBQztvREFDRixJQUFJLEVBQUUsTUFBTTtpREFDYixDQUFDOzRDQUNGLElBQUksRUFBRSxNQUFNOzRDQUNaLFNBQVMsRUFBRSxPQUFPOzRDQUNsQixXQUFXLEVBQUUsT0FBTzt5Q0FDckIsQ0FBQztvQ0FDRixvQkFBb0IsRUFBRSxDQUFDOzRDQUNyQixJQUFJLEVBQUUsTUFBTTs0Q0FDWixZQUFZLEVBQUUsQ0FBQztvREFDYixJQUFJLEVBQUUsTUFBTTtvREFDWixTQUFTLEVBQUUsQ0FBQzs0REFDVixJQUFJLEVBQUUsTUFBTTs0REFDWixTQUFTLEVBQUUsT0FBTzs0REFDbEIsSUFBSSxFQUFFLE1BQU07eURBQ2IsQ0FBQztvREFDRixJQUFJLEVBQUUsTUFBTTtpREFDYixDQUFDOzRDQUNGLElBQUksRUFBRSxNQUFNO3lDQUNiLENBQUM7aUNBQ0gsQ0FBQzt5QkFDSDt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsY0FBYyxFQUFFOzRCQUNkLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNELFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsSUFBSTt5QkFDWDt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osSUFBSSxFQUFFLElBQUk7eUJBQ1g7d0JBQ0Qsa0JBQWtCLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQztxQkFDckMsQ0FBQzthQUNILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsc0JBQUM7QUFBRCxDQWxMQSxBQWtMQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFhLFdBQVcsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MnKTtcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvdXNlcicpO1xuaW1wb3J0IElSZWNydWl0ZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS9yZWNydWl0ZXInKTtcblxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xuXG5jbGFzcyBSZWNydWl0ZXJTY2hlbWEge1xuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcbiAgICBsZXQgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcbiAgICAgIHVzZXJJZDoge1xuICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1VzZXInXG4gICAgICB9LFxuICAgICAgY29tcGFueV9uYW1lOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGNvbXBhbnlfc2l6ZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBjb21wYW55X3dlYnNpdGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgY29tcGFueV9sb2dvOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGNvbXBhbnlfaGVhZHF1YXJ0ZXJfY291bnRyeToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBhYm91dF9jb21wYW55OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGlzUmVjcnVpdGluZ0ZvcnNlbGY6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhblxuICAgICAgfSxcbiAgICAgIHNldE9mRG9jdW1lbnRzOiB7XG4gICAgICAgIHR5cGU6IFtTdHJpbmddXG4gICAgICB9LFxuICAgICAgcG9zdGVkSm9iczogW3tcbiAgICAgICAgaXNKb2JQb3N0ZWQ6IHtcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGRheXNSZW1haW5pbmdGb3JFeHBpcmluZzoge1xuICAgICAgICAgIHR5cGU6IE51bWJlclxuICAgICAgICB9LFxuICAgICAgICBpc0pvYlBvc3RFeHBpcmVkOiB7XG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBpc0pvYlBvc3RDbG9zZWQ6IHtcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGlzSm9iU2hhcmVkOiB7XG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBoaWRlQ29tcGFueU5hbWU6IHtcbiAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGNhcGFiaWxpdHlfbWF0cml4OiB7XG4gICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4OiB7XG4gICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgIH0sXG4gICAgICAgIGpvYkNsb3NlUmVhc29uOntcbiAgICAgICAgICB0eXBlOiBOdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgY2FuZGlkYXRlX2xpc3Q6IFt7XG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgIGlkczogW3tcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICAgIH1dXG4gICAgICAgIH1dLFxuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgIGNpdHk6IFN0cmluZyxcbiAgICAgICAgICBzdGF0ZTogU3RyaW5nLFxuICAgICAgICAgIGNvdW50cnk6IFN0cmluZyxcbiAgICAgICAgICBwaW46IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBqb2luaW5nUGVyaW9kOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGpvYlRpdGxlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHNoYXJlZExpbms6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgaGlyaW5nTWFuYWdlcjoge1xuICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBkZXBhcnRtZW50OiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGVkdWNhdGlvbjoge1xuICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICAvKmV4cGVyaWVuY2U6IHtcbiAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICAgfSwqL1xuICAgICAgICBleHBlcmllbmNlTWluVmFsdWU6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgZXhwZXJpZW5jZU1heFZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHNhbGFyeU1pblZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHNhbGFyeU1heFZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIC8qc2FsYXJ5OiB7XG4gICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgIH0sKi9cbiAgICAgICAgcHJvZmljaWVuY2llczoge1xuICAgICAgICAgIHR5cGU6IFtTdHJpbmddXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9maWNpZW5jaWVzOiB7XG4gICAgICAgICAgdHlwZTogW1N0cmluZ11cbiAgICAgICAgfSxcbiAgICAgICAgaW50ZXJlc3RlZEluZHVzdHJpZXM6IHtcbiAgICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgICB9LFxuXG4gICAgICAgIGluZHVzdHJ5OiB7XG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICByb2xlczogW3tcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICAgIGNhcGFiaWxpdGllczogW3tcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcbiAgICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXG4gICAgICAgICAgICAgIGlzU2Vjb25kYXJ5OiBCb29sZWFuXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xuICAgICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGV0ZW5jaWVzOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3BvbnNpYmlsaXR5OiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHBvc3RpbmdEYXRlOiB7XG4gICAgICAgICAgdHlwZTogRGF0ZVxuICAgICAgICB9LFxuICAgICAgICBleHBpcmluZ0RhdGU6IHtcbiAgICAgICAgICB0eXBlOiBEYXRlXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGV2ZW50SW5kdXN0cmllczogW3t0eXBlOiBTdHJpbmd9XVxuICAgICAgfV1cbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cbn1cbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVJlY3J1aXRlcj4oJ1JlY3J1aXRlcicsIFJlY3J1aXRlclNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
