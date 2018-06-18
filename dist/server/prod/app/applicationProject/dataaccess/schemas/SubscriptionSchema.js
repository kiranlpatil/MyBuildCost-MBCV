"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var SubscriptionSchema = (function () {
    function SubscriptionSchema() {
    }
    Object.defineProperty(SubscriptionSchema, "schema", {
        get: function () {
            var schema = new mongoose_1.Schema({
                basePackage: {
                    type: Object
                },
                addOnPackage: {
                    type: Object
                }
            }, {
                versionKey: false,
                timestamps: true
            });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return SubscriptionSchema;
}());
var schema = mongooseConnection.model('Subscription', SubscriptionSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1N1YnNjcmlwdGlvblNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBR3hFLHFDQUFnQztBQUVoQyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQWtCQSxDQUFDO0lBakJDLHNCQUFXLDRCQUFNO2FBQWpCO1lBRUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxpQkFBTSxDQUFDO2dCQUVwQixXQUFXLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsWUFBWSxFQUFFO29CQUNkLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBQ0YsRUFDQztnQkFDRSxVQUFVLEVBQUUsS0FBSztnQkFDakIsVUFBVSxFQUFDLElBQUk7YUFDaEIsQ0FBQyxDQUFDO1lBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHlCQUFDO0FBQUQsQ0FsQkEsQUFrQkMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBZSxjQUFjLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0YsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1N1YnNjcmlwdGlvblNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvU3Vic2NyaXB0aW9uJyk7XHJcbmltcG9ydCBCYXNlU3Vic2NyaXB0aW9uUGFja2FnZSA9IHJlcXVpcmUoJy4uL21vZGVsL3Byb2plY3QvU3Vic2NyaXB0aW9uL0Jhc2VTdWJzY3JpcHRpb25QYWNrYWdlJyk7XHJcbmltcG9ydCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIFN1YnNjcmlwdGlvblNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xyXG5cclxuICAgICAgICBiYXNlUGFja2FnZToge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgICB9LFxyXG4gICAgICAgIGFkZE9uUGFja2FnZToge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxTdWJzY3JpcHRpb24+KCdTdWJzY3JpcHRpb24nLCBTdWJzY3JpcHRpb25TY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
