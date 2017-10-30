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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUU3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DO0lBQUE7SUEwSkEsQ0FBQztJQXpKQyxzQkFBVyx5QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBRTVCLFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU07aUJBQ2xEO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUMsSUFBSTtpQkFDVjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsaUJBQWlCLEVBQUc7b0JBQ2xCLElBQUksRUFBRyxNQUFNO2lCQUNkO2dCQUNELHNCQUFzQixFQUFHO29CQUN2QixJQUFJLEVBQUcsTUFBTTtpQkFDZDtnQkFDRCx1QkFBdUIs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QUFLLEVBQUUsTUFBTTs0QkFDYixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRCxPQUFPLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQztnQkFDRixhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNmO2dCQUNELFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsSUFBSTtpQkFDWDtnQkFDRCxRQUFRLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsTUFBTTt3QkFDWixHQUFHLEVBQUUsQ0FBQztnQ0FDSixJQUFJLEVBQUUsTUFBTTs2QkFDYixDQUFDO3FCQUNILENBQUM7YUFFSCxFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHNCQUFDO0FBQUQsQ0ExSkEsQUEwSkMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYSxXQUFXLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZGLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9jYW5kaWRhdGUuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzJyk7XHJcbmltcG9ydCBJQ2FuZGlkYXRlID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvY2FuZGlkYXRlJyk7XHJcbnZhciBtb25nb29zZTEgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxudmFyIG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcclxuXHJcbmNsYXNzIENhbmRpZGF0ZVNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICB2YXIgc2NoZW1hID0gbW9uZ29vc2UxLlNjaGVtYSh7XHJcblxyXG4gICAgICBqb2JUaXRsZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICByb2xlVHlwZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICB1c2VySWQ6IHtcclxuICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1VzZXInXHJcbiAgICAgIH0sXHJcbiAgICAgIGlzQ29tcGxldGVkOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBpc1N1Ym1pdHRlZDoge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgaXNWaXNpYmxlOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RVcGRhdGVBdDoge1xyXG4gICAgICAgIHR5cGU6RGF0ZVxyXG4gICAgICB9LFxyXG4gICAgICBhYm91dE15c2VsZjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjYXBhYmlsaXR5X21hdHJpeCA6IHtcclxuICAgICAgICB0eXBlIDogT2JqZWN0XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbXBsZXhpdHlfbm90ZV9tYXRyaXggOiB7XHJcbiAgICAgICAgdHlwZSA6IE9iamVjdFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9maWxlX3VwZGF0ZV90cmFja2luZyA6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgZGVmYXVsdDotMVxyXG4gICAgICB9LFxyXG4gICAgICBjZXJ0aWZpY2F0aW9uczogW3tcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgeWVhcjogTnVtYmVyLFxyXG4gICAgICAgIGlzc3VlZEJ5OiBTdHJpbmcsXHJcbiAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgIHJlbWFyazogU3RyaW5nXHJcbiAgICAgIH1dLFxyXG4gICAgICBpbnRlcmVzdGVkSW5kdXN0cmllczoge1xyXG4gICAgICAgIHR5cGU6IFtTdHJpbmddXHJcbiAgICAgIH0sXHJcbiAgICAgIGF3YXJkczogW3tcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgeWVhcjogTnVtYmVyLFxyXG4gICAgICAgIGlzc3VlZEJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcmVtYXJrOiBTdHJpbmdcclxuICAgICAgfV0sXHJcbiAgICAgIGluZHVzdHJ5OiB7XHJcbiAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICByb2xlczogW3tcclxuICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgIGNhcGFiaWxpdGllczogW3tcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgICAgIHNjZW5hcmlvczogW3tcclxuICAgICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IFN0cmluZ1xyXG4gICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBpc1ByaW1hcnk6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgIGlzU2Vjb25kYXJ5OiBCb29sZWFuXHJcbiAgICAgICAgICB9XSxcclxuICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiBbe1xyXG4gICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgc2NlbmFyaW9zOiBbe1xyXG4gICAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfV1cclxuICAgICAgfSxcclxuICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgYWNhZGVtaWNzOiBbe1xyXG4gICAgICAgIHNjaG9vbE5hbWU6IFN0cmluZyxcclxuICAgICAgICBib2FyZDogU3RyaW5nLFxyXG4gICAgICAgIHllYXJPZlBhc3Npbmc6IE51bWJlcixcclxuICAgICAgICBzcGVjaWFsaXphdGlvbjogU3RyaW5nXHJcbiAgICAgIH1dLFxyXG4gICAgICBwcm9mZXNzaW9uYWxEZXRhaWxzOiB7XHJcbiAgICAgICAgZWR1Y2F0aW9uOiBTdHJpbmcsXHJcbiAgICAgICAgZXhwZXJpZW5jZTogU3RyaW5nLFxyXG4gICAgICAgIGN1cnJlbnRTYWxhcnk6IFN0cmluZyxcclxuICAgICAgICBub3RpY2VQZXJpb2Q6IFN0cmluZyxcclxuICAgICAgICByZWxvY2F0ZTogU3RyaW5nLFxyXG4gICAgICAgIGluZHVzdHJ5RXhwb3N1cmU6IFN0cmluZyxcclxuICAgICAgICBjdXJyZW50Q29tcGFueTogU3RyaW5nLFxyXG4gICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgICBzdGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgY291bnRyeTogU3RyaW5nLFxyXG4gICAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBlbXBsb3ltZW50SGlzdG9yeTogW3tcclxuICAgICAgICBjb21wYW55TmFtZTogU3RyaW5nLFxyXG4gICAgICAgIGRlc2lnbmF0aW9uOiBTdHJpbmcsXHJcbiAgICAgICAgaXNQcmVzZW50bHlXb3JraW5nOiBCb29sZWFuLFxyXG4gICAgICAgIGZyb206IHtcclxuICAgICAgICAgIG1vbnRoOiBTdHJpbmcsXHJcbiAgICAgICAgICB5ZWFyOiBOdW1iZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvOiB7XHJcbiAgICAgICAgICBtb250aDogU3RyaW5nLFxyXG4gICAgICAgICAgeWVhcjogTnVtYmVyXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1hcmtzOiBTdHJpbmdcclxuICAgICAgfV0sXHJcbiAgICAgIHByb2ZpY2llbmNpZXM6IHtcclxuICAgICAgICB0eXBlOiBbU3RyaW5nXVxyXG4gICAgICB9LFxyXG4gICAgICBsb2NrZWRPbjoge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgICAgfSxcclxuICAgICAgam9iX2xpc3Q6IFt7XHJcbiAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgIGlkczogW3tcclxuICAgICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1dLFxyXG5cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG5cclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SUNhbmRpZGF0ZT4oJ0NhbmRpZGF0ZScsIENhbmRpZGF0ZVNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
