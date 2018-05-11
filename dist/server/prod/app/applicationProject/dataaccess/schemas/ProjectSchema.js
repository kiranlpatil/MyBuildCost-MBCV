"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ProjectSchema = (function () {
    function ProjectSchema() {
    }
    Object.defineProperty(ProjectSchema, "schema", {
        get: function () {
            var schema = new mongoose_1.Schema({
                name: {
                    type: String,
                    required: true
                },
                region: {
                    type: String
                },
                buildings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Building' }],
                address: {
                    city: String,
                    state: String,
                    country: String,
                    pin: String
                },
                plotArea: {
                    type: Number
                },
                slabArea: {
                    type: Number
                },
                podiumArea: {
                    type: Number
                },
                openSpace: {
                    type: Number
                },
                poolCapacity: {
                    type: Number
                },
                totalNumOfBuildings: {
                    type: Number
                },
                plotPeriphery: {
                    type: Number
                },
                projectCostHeads: [{}],
                rates: [{}],
                projectDuration: {
                    type: Number
                },
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
    return ProjectSchema;
}());
var schema = mongooseConnection.model('Project', ProjectSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1Byb2plY3RTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFFQUF3RTtBQUd4RSxxQ0FBa0M7QUFFbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUF1REEsQ0FBQztJQXREQyxzQkFBVyx1QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztnQkFFdEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxJQUFJO2lCQUNmO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxpQkFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBQyxDQUFDO2dCQUMzRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLE1BQU07b0JBQ2IsT0FBTyxFQUFFLE1BQU07b0JBQ2YsR0FBRyxFQUFFLE1BQU07aUJBQ1o7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFFBQVEsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxVQUFVLEVBQUU7b0JBQ1osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsU0FBUyxFQUFFO29CQUNYLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFlBQVksRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxtQkFBbUIsRUFBRTtvQkFDckIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGdCQUFnQixFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN0QixLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGVBQWUsRUFBRTtvQkFDZixJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGLEVBQ0M7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFVBQVUsRUFBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxvQkFBQztBQUFELENBdkRBLEFBdURDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQVUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL3NjaGVtYXMvUHJvamVjdFNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgUHJvamVjdCA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL1Byb2plY3QnKTtcclxuaW1wb3J0IEJ1aWxkaW5nID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG5sZXQgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5cclxuY2xhc3MgUHJvamVjdFNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xyXG5cclxuICAgICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICByZWdpb246IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgYnVpbGRpbmdzOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnQnVpbGRpbmcnfV0sXHJcbiAgICAgIGFkZHJlc3M6IHtcclxuICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgcGxvdEFyZWE6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBzbGFiQXJlYToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIHBvZGl1bUFyZWE6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBvcGVuU3BhY2U6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBwb29sQ2FwYWNpdHk6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICB0b3RhbE51bU9mQnVpbGRpbmdzOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsb3RQZXJpcGhlcnk6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgcHJvamVjdENvc3RIZWFkczogW3t9XSxcclxuICAgICAgcmF0ZXM6IFt7fV0sXHJcbiAgICAgIHByb2plY3REdXJhdGlvbjoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBhY3RpdmF0aW9uX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxQcm9qZWN0PignUHJvamVjdCcsIFByb2plY3RTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
