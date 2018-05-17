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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1JhdGVBbmFseXNpc1NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBRXhFLHFDQUFnQztBQUVoQyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQWVBLENBQUM7SUFkQyxzQkFBVyw0QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztnQkFDcEIsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDbkIsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUNuQixFQUNEO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixVQUFVLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gseUJBQUM7QUFBRCxDQWZBLEFBZUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBZSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0YsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1JhdGVBbmFseXNpc1NjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvUmF0ZUFuYWx5c2lzJyk7XHJcbmltcG9ydCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIFJhdGVBbmFseXNpc1NjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xyXG4gICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzOiBbe31dLFxyXG4gICAgICAgIGJ1aWxkaW5nUmF0ZXM6IFt7fV0sXHJcbiAgICAgICAgcHJvamVjdENvc3RIZWFkczogW3t9XSxcclxuICAgICAgICBwcm9qZWN0UmF0ZXM6IFt7fV1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHZlcnNpb25LZXk6IGZhbHNlLFxyXG4gICAgICAgIHRpbWVzdGFtcHM6dHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8UmF0ZUFuYWx5c2lzPignUmF0ZUFuYWx5c2lzJywgUmF0ZUFuYWx5c2lzU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
