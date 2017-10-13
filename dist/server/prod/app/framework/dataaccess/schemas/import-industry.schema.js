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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2ltcG9ydC1pbmR1c3RyeS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXdEQSxDQUFDO0lBdkRDLHNCQUFXLDhCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsS0FBSyxFQUFFLENBQUM7d0JBQ04sSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLE1BQU07d0JBQ1osVUFBVSxFQUFFLE1BQU07d0JBQ2xCLFlBQVksRUFBRSxDQUFDO2dDQUNiLFVBQVUsRUFBRSxNQUFNO2dDQUNsQixJQUFJLEVBQUUsTUFBTTtnQ0FDWixZQUFZLEVBQUUsQ0FBQzt3Q0FDYixJQUFJLEVBQUUsTUFBTTt3Q0FDWixVQUFVLEVBQUUsTUFBTTt3Q0FDbEIsb0JBQW9CLEVBQUUsTUFBTTt3Q0FDNUIsb0JBQW9CLEVBQUUsTUFBTTt3Q0FDNUIsMEJBQTBCLEVBQUUsTUFBTTt3Q0FDbEMsMEJBQTBCLEVBQUUsTUFBTTt3Q0FDbEMsU0FBUyxFQUFFLENBQUM7Z0RBQ1YsSUFBSSxFQUFFLE1BQU07Z0RBQ1osSUFBSSxFQUFFLE1BQU07NkNBQ2IsQ0FBQzt3Q0FDRixJQUFJLEVBQUUsTUFBTTtxQ0FDYixDQUFDO2dDQUNGLElBQUksRUFBRSxNQUFNOzZCQUNiLENBQUM7d0JBQ0Ysb0JBQW9CLEVBQUUsQ0FBQztnQ0FDckIsVUFBVSxFQUFFLE1BQU07Z0NBQ2xCLElBQUksRUFBRSxNQUFNO2dDQUNaLFlBQVksRUFBRSxDQUFDO3dDQUNiLFVBQVUsRUFBRSxNQUFNO3dDQUNsQixJQUFJLEVBQUUsTUFBTTt3Q0FDWixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QixvQkFBb0IsRUFBRSxNQUFNO3dDQUM1QiwwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQywwQkFBMEIsRUFBRSxNQUFNO3dDQUNsQyxTQUFTLEVBQUUsQ0FBQztnREFDVixJQUFJLEVBQUUsTUFBTTtnREFDWixTQUFTLEVBQUUsT0FBTztnREFDbEIsSUFBSSxFQUFFLE1BQU07NkNBQ2IsQ0FBQzt3Q0FDRixJQUFJLEVBQUUsTUFBTTtxQ0FDYixDQUFDO2dDQUNGLElBQUksRUFBRSxNQUFNOzZCQUNiLENBQUM7cUJBQ0gsQ0FBQztnQkFDRixZQUFZLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBRUYsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCwyQkFBQztBQUFELENBeERBLEFBd0RDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWtCLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RHLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9pbXBvcnQtaW5kdXN0cnkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDcvMTEvMjAxNy5cclxuICovXHJcbmltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XHJcbmltcG9ydCBJbXBvcnRJbmR1c3RyeU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2luZHVzdHJ5LWNsYXNzLm1vZGVsXCIpO1xyXG5pbXBvcnQgSUltcG9ydEluZHVzdHJ5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2ltcG9ydC1pbmR1c3RyeVwiKTtcclxuXHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgSW1wb3J0SW5kdXN0cnlTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgIHJvbGVzOiBbe1xyXG4gICAgICAgIG5hbWU6IFN0cmluZyxcclxuICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgc29ydF9vcmRlcjogTnVtYmVyLFxyXG4gICAgICAgIGNhcGFiaWxpdGllczogW3tcclxuICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgIGNvZGU6IFN0cmluZyxcclxuICAgICAgICAgIGNvbXBsZXhpdGllczogW3tcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uRm9yUmVjcnVpdGVyOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIHNjZW5hcmlvczogW3tcclxuICAgICAgICAgICAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgICAgICAgY29kZTogU3RyaW5nXHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgbmFtZTogU3RyaW5nXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICBzb3J0X29yZGVyOiBOdW1iZXIsXHJcbiAgICAgICAgICBjb2RlOiBTdHJpbmcsXHJcbiAgICAgICAgICBjb21wbGV4aXRpZXM6IFt7XHJcbiAgICAgICAgICAgIHNvcnRfb3JkZXI6IE51bWJlcixcclxuICAgICAgICAgICAgY29kZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkZvckNhbmRpZGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZTogU3RyaW5nLFxyXG4gICAgICAgICAgICBxdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlcjogU3RyaW5nLFxyXG4gICAgICAgICAgICBzY2VuYXJpb3M6IFt7XHJcbiAgICAgICAgICAgICAgbmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgIGlzQ2hlY2tlZDogQm9vbGVhbixcclxuICAgICAgICAgICAgICBjb2RlOiBTdHJpbmdcclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgIG5hbWU6IFN0cmluZ1xyXG4gICAgICAgICAgfV0sXHJcbiAgICAgICAgICBuYW1lOiBTdHJpbmdcclxuICAgICAgICB9XVxyXG4gICAgICB9XSxcclxuICAgICAgY2FwYWJpbGl0aWVzOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIGluZHVzdHJ5OiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElJbXBvcnRJbmR1c3RyeT4oXCJJbXBvcnRJbmR1c3RyeVwiLCBJbXBvcnRJbmR1c3RyeVNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
