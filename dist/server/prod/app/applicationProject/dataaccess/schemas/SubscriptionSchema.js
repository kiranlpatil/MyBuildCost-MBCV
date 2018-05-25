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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1N1YnNjcmlwdGlvblNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBR3hFLHFDQUFnQztBQUVoQyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXFCQSxDQUFDO0lBcEJDLHNCQUFXLDRCQUFNO2FBQWpCO1lBRUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxpQkFBTSxDQUFDO2dCQUVwQixXQUFXLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsV0FBVyxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLE9BQU8sRUFBRTtvQkFDVCxJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGLEVBQ0M7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFVBQVUsRUFBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCx5QkFBQztBQUFELENBckJBLEFBcUJDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQWUsY0FBYyxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9GLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3Mvc2NoZW1hcy9TdWJzY3JpcHRpb25TY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IFN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL1N1YnNjcmlwdGlvbicpO1xyXG5pbXBvcnQgQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9CYXNlU3Vic2NyaXB0aW9uUGFja2FnZScpO1xyXG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG5sZXQgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5jbGFzcyBTdWJzY3JpcHRpb25TY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBuZXcgU2NoZW1hKHtcclxuXHJcbiAgICAgICAgYmFzZVBhY2thZ2U6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3RcclxuICAgICAgfSxcclxuICAgICAgICBhZGRCdWlsZGluZzoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgICB9LFxyXG4gICAgICAgIHJlbmV3YWw6IHtcclxuICAgICAgICB0eXBlOiBPYmplY3RcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHZlcnNpb25LZXk6IGZhbHNlLFxyXG4gICAgICAgIHRpbWVzdGFtcHM6dHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbmxldCBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8U3Vic2NyaXB0aW9uPignU3Vic2NyaXB0aW9uJywgU3Vic2NyaXB0aW9uU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
