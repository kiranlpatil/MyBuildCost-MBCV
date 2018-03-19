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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0J1aWxkaW5nU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBd0U7QUFJeEUsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUEwREEsQ0FBQztJQXpEQyxzQkFBVyx3QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBRTNCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QscUJBQXFCLEVBQUU7b0JBQ3JCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLHVCQUF1QixFQUFFO29CQUN6QixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsZ0JBQWdCLEVBQUM7b0JBQ2pCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLGtCQUFrQixFQUFDO29CQUNuQixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxtQkFBbUIsRUFBQztvQkFDcEIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsWUFBWSxFQUFFO29CQUNkLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFlBQVksRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNmLGVBQWUsRUFBRTtvQkFDZixJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGLEVBQ0M7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFVBQVUsRUFBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxxQkFBQztBQUFELENBMURBLEFBMERDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQVcsVUFBVSxFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL3NjaGVtYXMvQnVpbGRpbmdTY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IEJ1aWxkaW5nID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IENhdGVnb3J5ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvQ29zdEhlYWQnKTtcclxuXHJcbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgQnVpbGRpbmdTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG5cclxuICAgICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICB0b3RhbFNsYWJBcmVhOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIHRvdGFsQ2FycGV0QXJlYU9mVW5pdDoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIHRvdGFsU2FsZWFibGVBcmVhT2ZVbml0OiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgcGxpbnRoQXJlYTp7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgdG90YWxOdW1PZkZsb29yczp7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgICAgbnVtT2ZQYXJraW5nRmxvb3JzOntcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBjYXJwZXRBcmVhT2ZQYXJraW5nOntcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgbnVtT2ZPbmVCSEs6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgbnVtT2ZUd29CSEs6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgbnVtT2ZUaHJlZUJISzoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIG51bU9mRm91ckJISzoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIG51bU9mRml2ZUJISzoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIG51bU9mTGlmdHM6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgY29zdEhlYWRzOiBbe31dLFxyXG4gICAgICBhY3RpdmF0aW9uX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxCdWlsZGluZz4oJ0J1aWxkaW5nJywgQnVpbGRpbmdTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
