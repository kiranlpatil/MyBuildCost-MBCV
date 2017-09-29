"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ImportIndustrySchema = (function () {
    function ImportIndustrySchema() {
    }
    Object.defineProperty(ImportIndustrySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                roles: [{
                        name: String,
                        code: String,
                        sort_order: Number,
                        capabilities: [{
                                sort_order: Number,
                                code: String,
                                complexities: [{
                                        code: String,
                                        sort_order: Number,
                                        questionForCandidate: String,
                                        questionForRecruiter: String,
                                        questionHeaderForCandidate: String,
                                        questionHeaderForRecruiter: String,
                                        scenarios: [{
                                                name: String,
                                                code: String
                                            }],
                                        name: String
                                    }],
                                name: String
                            }],
                        default_complexities: [{
                                sort_order: Number,
                                code: String,
                                complexities: [{
                                        sort_order: Number,
                                        code: String,
                                        questionForCandidate: String,
                                        questionForRecruiter: String,
                                        questionHeaderForCandidate: String,
                                        questionHeaderForRecruiter: String,
                                        scenarios: [{
                                                name: String,
                                                isChecked: Boolean,
                                                code: String
                                            }],
                                        name: String
                                    }],
                                name: String
                            }]
                    }],
                capabilities: {
                    type: String
                },
                industry: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ImportIndustrySchema;
}());
var schema = mongooseConnection.model("ImportIndustry", ImportIndustrySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2ltcG9ydC1pbmR1c3RyeS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXdEQSxDQUFDO0lBdkRDLHNCQUFXLDhCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsS0FBSyxFQUFFLENBQUM7d0JBQ04sSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLE1BQU07d0JBQ1osVUFBVSxFQUFFLE1BQU07d0JBQ2xCLFlBQVksRUFBRSxDQUFDO2dDQUNiLFVBQVUsRUFBRSxNQUFNO2dDQUNsQixJQUFJLEVBQUUsTUFBTTtnQ0FDWixZQUFZLEVBQUUsQ0FBQzt3Q0FDYixJQUFJLEVBQUUsTUFBTTt3Q0FDWixVQUFVLEVBQUUsTUFBTTt3Q0FDbEIsb0JBQW9CLEVBQUUsTUFBTTt3Q0FDNUIsb0JBQW9CLEVBQUUsTUFBTTt3Q0FDNUIsMEJBQTBCLEVBQUUsTUFBTTt3Q0FDbEMsMEJBQTBCLEVBQUUsTUFBTTt3Q0FDbEMsU0FBUyxFQUFFLENBQUM7Z0RBQ1YsSUFBSSxFQUFFLE1BQU07Z0RBQ1osSUFBSSxFQUFFLE1BQU07NkNBQ2IsQ0FBQzt3Q0FDRixJQUFJLEVBQUUsTUFBTTtxQ0FDYixDQUFDO2dDQUNGLElBQUksRUFBRSxNQUFNOzZCQUNiLENBQUM7d0JBQ0Ysb0JBQW9CLEVBQUUsQ0FBQztnQ0FDckIsVUFBVSxFQUFFLE1BQU07Z0NBQ2xCLElBQUksRUFBRSxNQUFNO2dDQUNaLFlBQVksRUFBRSxDQUFDO3dDQUNiLFVBQVUsRUFBRSxNQUFNO3dDQUNsQixJQUFJLEVBQUUsTUFBTTt3Q0FDWixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QiwwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQywwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQyxTQUFTLEVBQUUsQ0FBQztnREFDVixJQUFJLEVBQUUsTUFBTTtnREFDWixTQUFTLEVBQUUsT0FBTztnREFDbEIsSUFBSSxFQUFFLE1BQU07NkNBQ2IsQ0FBQzt3Q0FDRixJQUFJLEVBQUUsTUFBTTtxQ0FDYixDQUFDO2dDQUNGLElBQUksRUFBRSxNQUFNOzZCQUNiLENBQUM7cUJBQ0gsQ0FBQztnQkFDRixZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBRUYsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCwyQkFBQztBQUFELENBeERBLEFBd0RDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWtCLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RHLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9pbXBvcnQtaW5kdXN0cnkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA3LzExLzIwMTcuXG4gKi9cbmltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XG5pbXBvcnQgSW1wb3J0SW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9pbmR1c3RyeS1jbGFzcy5tb2RlbFwiKTtcbmltcG9ydCBJSW1wb3J0SW5kdXN0cnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvaW1wb3J0LWluZHVzdHJ5XCIpO1xuXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XG5cbmNsYXNzIEltcG9ydEluZHVzdHJ5U2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgICByb2xlczogW3tcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgY2FwYWJpbGl0aWVzOiBbe1xuICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgcXVlc3Rpb25Gb3JDYW5kaWRhdGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yUmVjcnVpdGVyOiBTdHJpbmcsXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZTogU3RyaW5nLFxuICAgICAgICAgICAgcXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXI6IFN0cmluZyxcbiAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgIH1dLFxuICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogW3tcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXG4gICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogU3RyaW5nLFxuICAgICAgICAgICAgcXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyOiBTdHJpbmcsXG4gICAgICAgICAgICBzY2VuYXJpb3M6IFt7XG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgIH1dXG4gICAgICB9XSxcbiAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBpbmR1c3RyeToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH1cblxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xuXG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxufVxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJSW1wb3J0SW5kdXN0cnk+KFwiSW1wb3J0SW5kdXN0cnlcIiwgSW1wb3J0SW5kdXN0cnlTY2hlbWEuc2NoZW1hKTtcbmV4cG9ydCA9IHNjaGVtYTtcbiJdfQ==
