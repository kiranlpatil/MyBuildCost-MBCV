"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ProfessionalDetailsSchema = (function () {
    function ProfessionalDetailsSchema() {
    }
    Object.defineProperty(ProfessionalDetailsSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                relocate: {
                    type: String
                },
                education: {
                    type: String
                },
                currentSalary: {
                    type: String
                },
                experience: {
                    type: String
                },
                noticePeriod: {
                    type: String
                },
                industryExposure: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ProfessionalDetailsSchema;
}());
var schema = mongooseConnection.model("ProfessionalDetails", ProfessionalDetailsSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2Zlc3Npb25hbC1kZXRhaWxzLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBSTdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBeUJBLENBQUM7SUF4QkMsc0JBQVcsbUNBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsZ0NBQUM7QUFBRCxDQXpCQSxBQXlCQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUF1QixxQkFBcUIsRUFBRSx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNySCxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvcHJvZmVzc2lvbmFsLWRldGFpbHMuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcclxuaW1wb3J0IElMb2NhdGlvbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9sb2NhdGlvblwiKTtcclxuaW1wb3J0IElQcm9mZXNzaW9uYWxEZXRhaWxzID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3Byb2Zlc3Npb25hbC1kZXRhaWxzXCIpO1xyXG5cclxudmFyIG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5jbGFzcyBQcm9mZXNzaW9uYWxEZXRhaWxzU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICByZWxvY2F0ZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBlZHVjYXRpb246IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgY3VycmVudFNhbGFyeToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBleHBlcmllbmNlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIG5vdGljZVBlcmlvZDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBpbmR1c3RyeUV4cG9zdXJlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH1cclxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xyXG5cclxuICAgIHJldHVybiBzY2hlbWE7XHJcbiAgfVxyXG59XHJcbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVByb2Zlc3Npb25hbERldGFpbHM+KFwiUHJvZmVzc2lvbmFsRGV0YWlsc1wiLCBQcm9mZXNzaW9uYWxEZXRhaWxzU2NoZW1hLnNjaGVtYSk7XHJcbmV4cG9ydCA9IHNjaGVtYTtcclxuIl19
