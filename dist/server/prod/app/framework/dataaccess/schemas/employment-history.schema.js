"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var EmploymentHistorySchema = (function () {
    function EmploymentHistorySchema() {
    }
    Object.defineProperty(EmploymentHistorySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                companyName: {
                    type: String
                },
                designation: {
                    type: String
                },
                from: {
                    type: Date
                },
                to: {
                    type: Date
                },
                remark: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return EmploymentHistorySchema;
}());
var schema = mongooseConnection.model("EmploymentHistory", EmploymentHistorySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2VtcGxveW1lbnQtaGlzdG9yeS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXdCQSxDQUFDO0lBdkJDLHNCQUFXLGlDQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFFM0IsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0QsRUFBRSxFQUFFO29CQUNGLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUVGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsOEJBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUF1QixtQkFBbUIsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqSCxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvZW1wbG95bWVudC1oaXN0b3J5LnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XHJcbmltcG9ydCBJTG9jYXRpb24gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvbG9jYXRpb25cIik7XHJcbmltcG9ydCBJUHJvZmVzc2lvbmFsRGV0YWlscyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlsc1wiKTtcclxuXHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgRW1wbG95bWVudEhpc3RvcnlTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XHJcblxyXG4gICAgICBjb21wYW55TmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBkZXNpZ25hdGlvbjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBmcm9tOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZVxyXG4gICAgICB9LFxyXG4gICAgICB0bzoge1xyXG4gICAgICAgIHR5cGU6IERhdGVcclxuICAgICAgfSxcclxuICAgICAgcmVtYXJrOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElQcm9mZXNzaW9uYWxEZXRhaWxzPihcIkVtcGxveW1lbnRIaXN0b3J5XCIsIEVtcGxveW1lbnRIaXN0b3J5U2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
