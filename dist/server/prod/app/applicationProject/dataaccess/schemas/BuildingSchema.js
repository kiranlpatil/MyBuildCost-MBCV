"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var BuildingSchema = (function () {
    function BuildingSchema() {
    }
    Object.defineProperty(BuildingSchema, "schema", {
        get: function () {
            var schema = new mongoose_1.Schema({
                name: {
                    type: String
                },
                totalSlabArea: {
                    type: Number
                },
                totalCarpetAreaOfUnit: {
                    type: Number
                },
                totalSaleableAreaOfUnit: {
                    type: Number
                },
                plinthArea: {
                    type: Number
                },
                totalNumOfFloors: {
                    type: Number
                },
                numOfParkingFloors: {
                    type: Number
                },
                carpetAreaOfParking: {
                    type: Number
                },
                numOfOneBHK: {
                    type: Number
                },
                numOfTwoBHK: {
                    type: Number
                },
                numOfThreeBHK: {
                    type: Number
                },
                numOfFourBHK: {
                    type: Number
                },
                numOfFiveBHK: {
                    type: Number
                },
                numOfLifts: {
                    type: Number
                },
                costHeads: [{}],
                rates: [{}],
                activation_date: {
                    type: Date,
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
    return BuildingSchema;
}());
var schema = mongooseConnection.model('Building', BuildingSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0J1aWxkaW5nU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBd0U7QUFHeEUscUNBQWdDO0FBRWhDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBMkRBLENBQUM7SUExREMsc0JBQVcsd0JBQU07YUFBakI7WUFFRSxJQUFJLE1BQU0sR0FBRyxJQUFJLGlCQUFNLENBQUM7Z0JBRXRCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QscUJBQXFCLEVBQUU7b0JBQ3JCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLHVCQUF1QixFQUFFO29CQUN6QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsZ0JBQWdCLEVBQUM7b0JBQ2pCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLGtCQUFrQixFQUFDO29CQUNuQixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxtQkFBbUIsRUFBQztvQkFDcEIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsWUFBWSxFQUFFO29CQUNkLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFlBQVksRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNmLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDWCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRixFQUNDO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixVQUFVLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gscUJBQUM7QUFBRCxDQTNEQSxBQTJEQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFXLFVBQVUsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0J1aWxkaW5nU2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKCcuLi8uLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9kYXRhYWNjZXNzJyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCB7U2NoZW1hfSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIEJ1aWxkaW5nU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuXHJcbiAgICBsZXQgc2NoZW1hID0gbmV3IFNjaGVtYSh7XHJcblxyXG4gICAgICBuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHRvdGFsU2xhYkFyZWE6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgdG90YWxDYXJwZXRBcmVhT2ZVbml0OiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgdG90YWxTYWxlYWJsZUFyZWFPZlVuaXQ6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBwbGludGhBcmVhOntcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICB0b3RhbE51bU9mRmxvb3JzOntcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBudW1PZlBhcmtpbmdGbG9vcnM6e1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIGNhcnBldEFyZWFPZlBhcmtpbmc6e1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBudW1PZk9uZUJISzoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBudW1PZlR3b0JISzoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBudW1PZlRocmVlQkhLOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgbnVtT2ZGb3VyQkhLOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgbnVtT2ZGaXZlQkhLOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgbnVtT2ZMaWZ0czoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBjb3N0SGVhZHM6IFt7fV0sXHJcbiAgICAgIHJhdGVzOiBbe31dLFxyXG4gICAgICBhY3RpdmF0aW9uX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxCdWlsZGluZz4oJ0J1aWxkaW5nJywgQnVpbGRpbmdTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
