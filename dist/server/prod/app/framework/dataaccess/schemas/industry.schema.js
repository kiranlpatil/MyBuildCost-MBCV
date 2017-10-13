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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2luZHVzdHJ5LnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBSzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBMERBLENBQUM7SUF6REMsc0JBQVcsd0JBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFVBQVUsRUFBRSxNQUFNO2dCQUNsQixLQUFLLEVBQUUsQ0FBQzt3QkFDTixJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsTUFBTTt3QkFDWixVQUFVLEVBQUUsTUFBTTt3QkFDbEIsWUFBWSxFQUFFLENBQUM7Z0NBQ2IsVUFBVSxFQUFFLE1BQU07Z0NBQ2xCLElBQUksRUFBRSxNQUFNO2dDQUNaLFlBQVksRUFBRSxDQUFDO3dDQUNiLElBQUksRUFBRSxNQUFNO3dDQUNaLFVBQVUsRUFBRSxNQUFNO3dDQUNsQixRQUFRLEVBQUMsTUFBTTt3Q0FDZixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QiwwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQywwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQyxTQUFTLEVBQUUsQ0FBQztnREFDVixJQUFJLEVBQUUsTUFBTTtnREFDWixJQUFJLEVBQUUsTUFBTTs2Q0FDYixDQUFDO3dDQUNGLElBQUksRUFBRSxNQUFNO3FDQUNiLENBQUM7Z0NBQ0YsSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQzt3QkFDRixvQkFBb0IsRUFBRSxDQUFDO2dDQUNyQixVQUFVLEVBQUUsTUFBTTtnQ0FDbEIsSUFBSSxFQUFFLE1BQU07Z0NBQ1osWUFBWSxFQUFFLENBQUM7d0NBQ2IsVUFBVSxFQUFFLE1BQU07d0NBQ2xCLElBQUksRUFBRSxNQUFNO3dDQUNaLG9CQUFvQixFQUFFLE1BQU07d0NBQzVCLG9CQUFvQixFQUFFLE1BQU07d0NBQzVCLDBCQUEwQixFQUFFLE1BQU07d0NBQ2xDLDBCQUEwQixFQUFFLE1BQU07d0NBQ2xDLFNBQVMsRUFBRSxDQUFDO2dEQUNWLElBQUksRUFBRSxNQUFNO2dEQUNaLFNBQVMsRUFBRSxPQUFPO2dEQUNsQixJQUFJLEVBQUUsTUFBTTs2Q0FDYixDQUFDO3dDQUNGLElBQUksRUFBRSxNQUFNO3FDQUNiLENBQUM7Z0NBQ0YsSUFBSSxFQUFFLE1BQU07NkJBQ2IsQ0FBQztxQkFDSCxDQUFDO2FBRUgsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxxQkFBQztBQUFELENBMURBLEFBMERDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQVksVUFBVSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvaW5kdXN0cnkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcclxuaW1wb3J0IElTY2VuYXJpbyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9zY2VuYXJpb1wiKTtcclxuaW1wb3J0IElSb2xlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3JvbGVcIik7XHJcbmltcG9ydCBJSW5kdXN0cnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvaW5kdXN0cnlcIik7XHJcblxyXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIEluZHVzdHJ5U2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICBjb2RlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICByb2xlczogW3tcclxuICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICBjYXBhYmlsaXRpZXM6IFt7XHJcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgICAgICBxdWVzdGlvbjpTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yUmVjcnVpdGVyOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHNjZW5hcmlvczogW3tcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkZvckNhbmRpZGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlcjogU3RyaW5nLFxyXG4gICAgICAgICAgICBzY2VuYXJpb3M6IFt7XHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgfV0sXHJcbiAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICB9XVxyXG4gICAgICB9XVxyXG5cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG5cclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SUluZHVzdHJ5PihcIkluZHVzdHJ5XCIsIEluZHVzdHJ5U2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
