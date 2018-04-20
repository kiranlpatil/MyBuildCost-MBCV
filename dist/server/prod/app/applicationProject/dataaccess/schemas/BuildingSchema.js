"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var BuildingSchema = (function () {
    function BuildingSchema() {
    }
    Object.defineProperty(BuildingSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0J1aWxkaW5nU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBd0U7QUFJeEUsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUEyREEsQ0FBQztJQTFEQyxzQkFBVyx3QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBRTNCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QscUJBQXFCLEVBQUU7b0JBQ3JCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLHVCQUF1QixFQUFFO29CQUN6QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsZ0JBQWdCLEVBQUM7b0JBQ2pCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLGtCQUFrQixFQUFDO29CQUNuQixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxtQkFBbUIsRUFBQztvQkFDcEIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsWUFBWSxFQUFFO29CQUNkLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFlBQVksRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNmLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDWCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRixFQUNDO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixVQUFVLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gscUJBQUM7QUFBRCxDQTNEQSxBQTJEQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFXLFVBQVUsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0J1aWxkaW5nU2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKCcuLi8uLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9kYXRhYWNjZXNzJyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0Nvc3RIZWFkJyk7XHJcblxyXG5sZXQgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbmxldCBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIEJ1aWxkaW5nU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuXHJcbiAgICBsZXQgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuXHJcbiAgICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgdG90YWxTbGFiQXJlYToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICB0b3RhbENhcnBldEFyZWFPZlVuaXQ6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICB0b3RhbFNhbGVhYmxlQXJlYU9mVW5pdDoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIHBsaW50aEFyZWE6e1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIHRvdGFsTnVtT2ZGbG9vcnM6e1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIG51bU9mUGFya2luZ0Zsb29yczp7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgY2FycGV0QXJlYU9mUGFya2luZzp7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIG51bU9mT25lQkhLOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIG51bU9mVHdvQkhLOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIG51bU9mVGhyZWVCSEs6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBudW1PZkZvdXJCSEs6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBudW1PZkZpdmVCSEs6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBudW1PZkxpZnRzOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvc3RIZWFkczogW3t9XSxcclxuICAgICAgcmF0ZXM6IFt7fV0sXHJcbiAgICAgIGFjdGl2YXRpb25fZGF0ZToge1xyXG4gICAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB2ZXJzaW9uS2V5OiBmYWxzZSxcclxuICAgICAgICB0aW1lc3RhbXBzOnRydWVcclxuICAgICAgfSk7XHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG5sZXQgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPEJ1aWxkaW5nPignQnVpbGRpbmcnLCBCdWlsZGluZ1NjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
