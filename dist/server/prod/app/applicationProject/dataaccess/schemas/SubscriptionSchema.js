"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var SubscriptionSchema = (function () {
    function SubscriptionSchema() {
    }
    Object.defineProperty(SubscriptionSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                basePackage: {
                    type: Object
                },
                addBuilding: {
                    type: Object
                },
                renewal: {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1N1YnNjcmlwdGlvblNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBSXhFLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBcUJBLENBQUM7SUFwQkMsc0JBQVcsNEJBQU07YUFBakI7WUFFRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUV6QixXQUFXLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsV0FBVyxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLE9BQU8sRUFBRTtvQkFDVCxJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGLEVBQ0M7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFVBQVUsRUFBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCx5QkFBQztBQUFELENBckJBLEFBcUJDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWUsY0FBYyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9GLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3Mvc2NoZW1hcy9TdWJzY3JpcHRpb25TY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL1N1YnNjcmlwdGlvbicpO1xyXG5pbXBvcnQgQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9CYXNlU3Vic2NyaXB0aW9uUGFja2FnZScpO1xyXG5cclxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG5sZXQgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5jbGFzcyBTdWJzY3JpcHRpb25TY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG5cclxuICAgICAgICBiYXNlUGFja2FnZToge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgICB9LFxyXG4gICAgICAgIGFkZEJ1aWxkaW5nOiB7XHJcbiAgICAgICAgdHlwZTogT2JqZWN0XHJcbiAgICAgIH0sXHJcbiAgICAgICAgcmVuZXdhbDoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxTdWJzY3JpcHRpb24+KCdTdWJzY3JpcHRpb24nLCBTdWJzY3JpcHRpb25TY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
