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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQWlLQSxDQUFDO0lBaEtDLHNCQUFXLHlCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCwyQkFBMkIsRUFBRTtvQkFDM0IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELG1CQUFtQixFQUFFO29CQUNuQixJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFVBQVUsRUFBRSxDQUFDO3dCQUNYLFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsT0FBTzs0QkFDYixPQUFPLEVBQUUsS0FBSzt5QkFDZjt3QkFDRCx3QkFBd0IsRUFBRTs0QkFDeEIsSUFBSSxFQUFFLE1BQU07eUJBQ2I7d0JBQ0QsZ0JBQWdCLEVBQUU7NEJBQ2hC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WSxFQUFFOzRCQUNaLElBQUksRUFBRSxJQUFJO3lCQUNYO3dCQUNELGtCQUFrQixFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7cUJBQ3JDLENBQUM7YUFDSCxFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHNCQUFDO0FBQUQsQ0FqS0EsQUFpS0MsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYSxXQUFXLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZGLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9yZWNydWl0ZXIuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzJyk7XG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcbmltcG9ydCBJUmVjcnVpdGVyID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvcmVjcnVpdGVyJyk7XG5cbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgUmVjcnVpdGVyU2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgbGV0IHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgICB1c2VySWQ6IHtcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdVc2VyJ1xuICAgICAgfSxcbiAgICAgIGNvbXBhbnlfbmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBjb21wYW55X3NpemU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgY29tcGFueV93ZWJzaXRlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGNvbXBhbnlfbG9nbzoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBjb21wYW55X2hlYWRxdWFydGVyX2NvdW50cnk6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgYWJvdXRfY29tcGFueToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBpc1JlY3J1aXRpbmdGb3JzZWxmOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW5cbiAgICAgIH0sXG4gICAgICBzZXRPZkRvY3VtZW50czoge1xuICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgfSxcbiAgICAgIHBvc3RlZEpvYnM6IFt7XG4gICAgICAgIGlzSm9iUG9zdGVkOiB7XG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBkYXlzUmVtYWluaW5nRm9yRXhwaXJpbmc6IHtcbiAgICAgICAgICB0eXBlOiBOdW1iZXJcbiAgICAgICAgfSxcbiAgICAgICAgaXNKb2JQb3N0RXhwaXJlZDoge1xuICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZUNvbXBhbnlOYW1lOiB7XG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBjYXBhYmlsaXR5X21hdHJpeDoge1xuICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICB9LFxuICAgICAgICBjYW5kaWRhdGVfbGlzdDogW3tcbiAgICAgICAgICBuYW1lOiBTdHJpbmcsXG4gICAgICAgICAgaWRzOiBbe1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgICAgfV1cbiAgICAgICAgfV0sXG4gICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgY2l0eTogU3RyaW5nLFxuICAgICAgICAgIHN0YXRlOiBTdHJpbmcsXG4gICAgICAgICAgY291bnRyeTogU3RyaW5nLFxuICAgICAgICAgIHBpbjogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGpvaW5pbmdQZXJpb2Q6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgam9iVGl0bGU6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgaGlyaW5nTWFuYWdlcjoge1xuICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICBkZXBhcnRtZW50OiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIGVkdWNhdGlvbjoge1xuICAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICB9LFxuICAgICAgICAvKmV4cGVyaWVuY2U6IHtcbiAgICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgICAgfSwqL1xuICAgICAgICBleHBlcmllbmNlTWluVmFsdWU6IHtcbiAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgZXhwZXJpZW5jZU1heFZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHNhbGFyeU1pblZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHNhbGFyeU1heFZhbHVlOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIC8qc2FsYXJ5OiB7XG4gICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgIH0sKi9cbiAgICAgICAgcHJvZmljaWVuY2llczoge1xuICAgICAgICAgIHR5cGU6IFtTdHJpbmddXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9maWNpZW5jaWVzOiB7XG4gICAgICAgICAgdHlwZTogW1N0cmluZ11cbiAgICAgICAgfSxcbiAgICAgICAgaW50ZXJlc3RlZEluZHVzdHJpZXM6IHtcbiAgICAgICAgICB0eXBlOiBbU3RyaW5nXVxuICAgICAgICB9LFxuXG4gICAgICAgIGluZHVzdHJ5OiB7XG4gICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICByb2xlczogW3tcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICAgIGNhcGFiaWxpdGllczogW3tcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcbiAgICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXG4gICAgICAgICAgICAgIGlzU2Vjb25kYXJ5OiBCb29sZWFuXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xuICAgICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmdcbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgY29tcGV0ZW5jaWVzOiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3BvbnNpYmlsaXR5OiB7XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgIH0sXG4gICAgICAgIHBvc3RpbmdEYXRlOiB7XG4gICAgICAgICAgdHlwZTogRGF0ZVxuICAgICAgICB9LFxuICAgICAgICBleHBpcmluZ0RhdGU6IHtcbiAgICAgICAgICB0eXBlOiBEYXRlXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGV2ZW50SW5kdXN0cmllczogW3t0eXBlOiBTdHJpbmd9XVxuICAgICAgfV1cbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cbn1cbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVJlY3J1aXRlcj4oJ1JlY3J1aXRlcicsIFJlY3J1aXRlclNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
