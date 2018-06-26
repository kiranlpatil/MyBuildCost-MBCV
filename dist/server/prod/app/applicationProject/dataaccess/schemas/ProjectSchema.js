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
                activeStatus: {
                    type: Boolean
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1Byb2plY3RTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFFQUF3RTtBQUd4RSxxQ0FBa0M7QUFFbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUEwREEsQ0FBQztJQXpEQyxzQkFBVyx1QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztnQkFFdEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxJQUFJO2lCQUNmO2dCQUNELFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsT0FBTztpQkFDZDtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsaUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUMsQ0FBQztnQkFDM0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxNQUFNO29CQUNiLE9BQU8sRUFBRSxNQUFNO29CQUNmLEdBQUcsRUFBRSxNQUFNO2lCQUNaO2dCQUNELFFBQVEsRUFBRTtvQkFDUixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxRQUFRLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsVUFBVSxFQUFFO29CQUNaLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNDLFNBQVMsRUFBRTtvQkFDWCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDQyxZQUFZLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0MsbUJBQW1CLEVBQUU7b0JBQ3JCLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDdEIsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNYLGVBQWUsRUFBRTtvQkFDZixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRixFQUNDO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixVQUFVLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsb0JBQUM7QUFBRCxDQTFEQSxBQTBEQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFVLFNBQVMsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL1Byb2plY3RTY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IFByb2plY3QgPSByZXF1aXJlKCcuLi9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuXHJcbmNsYXNzIFByb2plY3RTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBuZXcgU2NoZW1hKHtcclxuXHJcbiAgICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgYWN0aXZlU3RhdHVzOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhblxyXG4gICAgICB9LFxyXG4gICAgICByZWdpb246IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgYnVpbGRpbmdzOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnQnVpbGRpbmcnfV0sXHJcbiAgICAgIGFkZHJlc3M6IHtcclxuICAgICAgICBjaXR5OiBTdHJpbmcsXHJcbiAgICAgICAgc3RhdGU6IFN0cmluZyxcclxuICAgICAgICBjb3VudHJ5OiBTdHJpbmcsXHJcbiAgICAgICAgcGluOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgcGxvdEFyZWE6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBzbGFiQXJlYToge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICAgIHBvZGl1bUFyZWE6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBvcGVuU3BhY2U6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICBwb29sQ2FwYWNpdHk6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgICB0b3RhbE51bU9mQnVpbGRpbmdzOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsb3RQZXJpcGhlcnk6IHtcclxuICAgICAgICB0eXBlOiBOdW1iZXJcclxuICAgICAgfSxcclxuICAgICAgcHJvamVjdENvc3RIZWFkczogW3t9XSxcclxuICAgICAgcmF0ZXM6IFt7fV0sXHJcbiAgICAgIHByb2plY3REdXJhdGlvbjoge1xyXG4gICAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgICB9LFxyXG4gICAgICBhY3RpdmF0aW9uX2RhdGU6IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdmVyc2lvbktleTogZmFsc2UsXHJcbiAgICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxubGV0IHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxQcm9qZWN0PignUHJvamVjdCcsIFByb2plY3RTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
