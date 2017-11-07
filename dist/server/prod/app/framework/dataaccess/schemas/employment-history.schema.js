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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2VtcGxveW1lbnQtaGlzdG9yeS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQUk3QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQXdCQSxDQUFDO0lBdkJDLHNCQUFXLGlDQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFFM0IsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLElBQUk7aUJBQ1g7Z0JBQ0QsRUFBRSxFQUFFO29CQUNGLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUVGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsOEJBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUF1QixtQkFBbUIsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqSCxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvZW1wbG95bWVudC1oaXN0b3J5LnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XG5pbXBvcnQgSUxvY2F0aW9uID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2xvY2F0aW9uXCIpO1xuaW1wb3J0IElQcm9mZXNzaW9uYWxEZXRhaWxzID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3Byb2Zlc3Npb25hbC1kZXRhaWxzXCIpO1xuXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XG5cbmNsYXNzIEVtcGxveW1lbnRIaXN0b3J5U2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG5cbiAgICAgIGNvbXBhbnlOYW1lOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGRlc2lnbmF0aW9uOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGZyb206IHtcbiAgICAgICAgdHlwZTogRGF0ZVxuICAgICAgfSxcbiAgICAgIHRvOiB7XG4gICAgICAgIHR5cGU6IERhdGVcbiAgICAgIH0sXG4gICAgICByZW1hcms6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9XG5cbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cbn1cbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVByb2Zlc3Npb25hbERldGFpbHM+KFwiRW1wbG95bWVudEhpc3RvcnlcIiwgRW1wbG95bWVudEhpc3RvcnlTY2hlbWEuc2NoZW1hKTtcbmV4cG9ydCA9IHNjaGVtYTtcbiJdfQ==
