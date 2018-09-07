"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var RateAnalysisSchema = (function () {
    function RateAnalysisSchema() {
    }
    Object.defineProperty(RateAnalysisSchema, "schema", {
        get: function () {
            var schema = new mongoose_1.Schema({
                region: String,
                buildingCostHeads: [{}],
                buildingRates: [{}],
                projectCostHeads: [{}],
                projectRates: [{}]
            }, {
                versionKey: false,
                timestamps: true
            });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return RateAnalysisSchema;
}());
var schema = mongooseConnection.model('RateAnalysis', RateAnalysisSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1JhdGVBbmFseXNpc1NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBRXhFLHFDQUFrQztBQUVsQyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQWdCQSxDQUFDO0lBZkMsc0JBQVcsNEJBQU07YUFBakI7WUFFRSxJQUFJLE1BQU0sR0FBRyxJQUFJLGlCQUFNLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRyxNQUFNO2dCQUNmLGlCQUFpQixFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN2QixhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ25CLGdCQUFnQixFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN0QixZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDbkIsRUFDRDtnQkFDRSxVQUFVLEVBQUUsS0FBSztnQkFDakIsVUFBVSxFQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1lBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHlCQUFDO0FBQUQsQ0FoQkEsQUFnQkMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBZSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0YsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1JhdGVBbmFseXNpc1NjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvUmF0ZUFuYWx5c2lzJyk7XHJcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuXHJcbiAgICBsZXQgc2NoZW1hID0gbmV3IFNjaGVtYSh7XHJcbiAgICAgICAgcmVnaW9uIDogU3RyaW5nLFxyXG4gICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzOiBbe31dLFxyXG4gICAgICAgIGJ1aWxkaW5nUmF0ZXM6IFt7fV0sXHJcbiAgICAgICAgcHJvamVjdENvc3RIZWFkczogW3t9XSxcclxuICAgICAgICBwcm9qZWN0UmF0ZXM6IFt7fV1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHZlcnNpb25LZXk6IGZhbHNlLFxyXG4gICAgICAgIHRpbWVzdGFtcHM6dHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8UmF0ZUFuYWx5c2lzPignUmF0ZUFuYWx5c2lzJywgUmF0ZUFuYWx5c2lzU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
