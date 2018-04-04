"use strict";
var DataAccess = require("../../../framework/dataaccess/dataaccess");
var mongoose_1 = require("mongoose");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var CompanySchema = (function () {
    function CompanySchema() {
    }
    Object.defineProperty(CompanySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                },
                address: {
                    type: String
                },
                users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
                projects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' }],
                subscription: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Subscription' },
                dateOfSubscription: {
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
    return CompanySchema;
}());
var schema = mongooseConnection.model('Company', CompanySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0NvbXBhbnlTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFFQUF3RTtBQUN4RSxxQ0FBa0M7QUFHbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUF3QkEsQ0FBQztJQXZCQyxzQkFBVyx1QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBRTNCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsS0FBSyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsaUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQztnQkFDbkQsUUFBUSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsaUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQztnQkFDekQsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFDO2dCQUNoRSxrQkFBa0IsRUFBRTtvQkFDbEIsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRixFQUNBO2dCQUNFLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixVQUFVLEVBQUMsSUFBSTthQUNoQixDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsb0JBQUM7QUFBRCxDQXhCQSxBQXdCQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFVLFNBQVMsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0NvbXBhbnlTY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uLy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgQ29tcGFueSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0NvbXBhbnknKTtcclxuXHJcbmxldCBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxubGV0IG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuXHJcbmNsYXNzIENvbXBhbnlTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG5cclxuICAgIGxldCBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG5cclxuICAgICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBhZGRyZXNzOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHVzZXJzOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcid9XSxcclxuICAgICAgcHJvamVjdHM6IFt7dHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdQcm9qZWN0J31dLFxyXG4gICAgICBzdWJzY3JpcHRpb246IHt0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1N1YnNjcmlwdGlvbid9LFxyXG4gICAgICBkYXRlT2ZTdWJzY3JpcHRpb246IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgIHtcclxuICAgICAgIHZlcnNpb25LZXk6IGZhbHNlLFxyXG4gICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgfSk7XHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG5sZXQgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPENvbXBhbnk+KCdDb21wYW55JywgQ29tcGFueVNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
