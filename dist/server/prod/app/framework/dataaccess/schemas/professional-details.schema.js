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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2Zlc3Npb25hbC1kZXRhaWxzLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBSTdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBeUJBLENBQUM7SUF4QkMsc0JBQVcsbUNBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUNGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsZ0NBQUM7QUFBRCxDQXpCQSxBQXlCQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUF1QixxQkFBcUIsRUFBRSx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNySCxpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3NjaGVtYXMvcHJvZmVzc2lvbmFsLWRldGFpbHMuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBJTG9jYXRpb24gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvbG9jYXRpb25cIik7XG5pbXBvcnQgSVByb2Zlc3Npb25hbERldGFpbHMgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvcHJvZmVzc2lvbmFsLWRldGFpbHNcIik7XG5cbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgUHJvZmVzc2lvbmFsRGV0YWlsc1NjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xuICAgICAgcmVsb2NhdGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgZWR1Y2F0aW9uOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIGN1cnJlbnRTYWxhcnk6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgZXhwZXJpZW5jZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBub3RpY2VQZXJpb2Q6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9LFxuICAgICAgaW5kdXN0cnlFeHBvc3VyZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH1cbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcblxuICAgIHJldHVybiBzY2hlbWE7XG4gIH1cbn1cbnZhciBzY2hlbWEgPSBtb25nb29zZUNvbm5lY3Rpb24ubW9kZWw8SVByb2Zlc3Npb25hbERldGFpbHM+KFwiUHJvZmVzc2lvbmFsRGV0YWlsc1wiLCBQcm9mZXNzaW9uYWxEZXRhaWxzU2NoZW1hLnNjaGVtYSk7XG5leHBvcnQgPSBzY2hlbWE7XG4iXX0=
