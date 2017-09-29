"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var IndustrySchema = (function () {
    function IndustrySchema() {
    }
    Object.defineProperty(IndustrySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                code: {
                    type: String
                },
                name: {
                    type: String
                },
                sort_order: Number,
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
                                        question: String,
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
                    }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return IndustrySchema;
}());
var schema = mongooseConnection.model("Industry", IndustrySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2luZHVzdHJ5LnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBSzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBMERBLENBQUM7SUF6REMsc0JBQVcsd0JBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRSxNQUFNO2dCQUNsQixLQUFLLEVBQUUsQ0FBQzt3QkFDTixJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsTUFBTTt3QkFDWixVQUFVLEVBQUUsTUFBTTt3QkFDbEIsWUFBWSxFQUFFLENBQUM7Z0NBQ2IsVUFBVSxFQUFFLE1BQU07Z0NBQ2xCLElBQUksRUFBRSxNQUFNO2dDQUNaLFlBQVksRUFBRSxDQUFDO3dDQUNiLElBQUksRUFBRSxNQUFNO3dDQUNaLFVBQVUsRUFBRSxNQUFNO3dDQUNsQixRQUFRLEVBQUMsTUFBTTt3Q0FDZixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QiwwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQywwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQyxTQUFTLEVBQUUsQ0FBQztnREFDVixJQUFJLEVBQUUsTUFBTTtnREFDWixJQUFJLEVBQUUsTUFBTTs2Q0FDYixDQUFDO3dDQUNGLElBQUksRUFBRSxNQUFNO3FDQUNiLENBQUM7Z0NBQ0YsSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQzt3QkFDRixvQkFBb0IsRUFBRSxDQUFDO2dDQUNyQixVQUFVLEVBQUUsTUFBTTtnQ0FDbEIsSUFBSSxFQUFFLE1BQU07Z0NBQ1osWUFBWSxFQUFFLENBQUM7d0NBQ2IsVUFBVSxFQUFFLE1BQU07d0NBQ2xCLElBQUksRUFBRSxNQUFNO3dDQUNaLG9CQUFvQixFQUFFLE1BQU07d0NBQzVCLG9CQUFvQixFQUFFLE1BQU07d0NBQzVCLDBCQUEwQixFQUFFLE1BQU07d0NBQ2xDLDBCQUEwQixFQUFFLE1BQU07d0NBQ2xDLFNBQVMsRUFBRSxDQUFDO2dEQUNWLElBQUksRUFBRSxNQUFNO2dEQUNaLFNBQVMsRUFBRSxPQUFPO2dEQUNsQixJQUFJLEVBQUUsTUFBTTs2Q0FDYixDQUFDO3dDQUNGLElBQUksRUFBRSxNQUFNO3FDQUNiLENBQUM7Z0NBQ0YsSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQztxQkFDSCxDQUFDO2FBRUgsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxxQkFBQztBQUFELENBMURBLEFBMERDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQVksVUFBVSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvaW5kdXN0cnkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBJU2NlbmFyaW8gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2Uvc2NlbmFyaW9cIik7XG5pbXBvcnQgSVJvbGUgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2Uvcm9sZVwiKTtcbmltcG9ydCBJSW5kdXN0cnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvaW5kdXN0cnlcIik7XG5cbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgSW5kdXN0cnlTY2hlbWEge1xuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcbiAgICB2YXIgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcbiAgICAgIGNvZGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICByb2xlczogW3tcbiAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgY2FwYWJpbGl0aWVzOiBbe1xuICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXG4gICAgICAgICAgY29tcGxleGl0aWVzOiBbe1xuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxuICAgICAgICAgICAgcXVlc3Rpb246U3RyaW5nLFxuICAgICAgICAgICAgcXVlc3Rpb25Gb3JDYW5kaWRhdGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yUmVjcnVpdGVyOiBTdHJpbmcsXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZTogU3RyaW5nLFxuICAgICAgICAgICAgcXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXI6IFN0cmluZyxcbiAgICAgICAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgIH1dLFxuICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogW3tcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXG4gICAgICAgICAgY29kZTogU3RyaW5nLFxuICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXG4gICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogU3RyaW5nLFxuICAgICAgICAgICAgcXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGU6IFN0cmluZyxcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyOiBTdHJpbmcsXG4gICAgICAgICAgICBzY2VuYXJpb3M6IFt7XG4gICAgICAgICAgICAgIG5hbWU6IFN0cmluZyxcbiAgICAgICAgICAgICAgaXNDaGVja2VkOiBCb29sZWFuLFxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgbmFtZTogU3RyaW5nXG4gICAgICAgIH1dXG4gICAgICB9XVxuXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG59XG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElJbmR1c3RyeT4oXCJJbmR1c3RyeVwiLCBJbmR1c3RyeVNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
