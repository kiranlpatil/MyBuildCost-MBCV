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
            var schema = new mongoose_1.Schema({
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9zY2hlbWFzL0NvbXBhbnlTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFFQUF3RTtBQUN4RSxxQ0FBa0M7QUFHbEMsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBR3ZEO0lBQUE7SUF3QkEsQ0FBQztJQXZCQyxzQkFBVyx1QkFBTTthQUFqQjtZQUVFLElBQUksTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztnQkFFdEIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxpQkFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDO2dCQUNuRCxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxpQkFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBQyxDQUFDO2dCQUN6RCxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsaUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUM7Z0JBQ2hFLGtCQUFrQixFQUFFO29CQUNsQixJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGLEVBQ0E7Z0JBQ0UsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFVBQVUsRUFBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxvQkFBQztBQUFELENBeEJBLEFBd0JDLElBQUE7QUFDRCxJQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQVUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRixpQkFBUyxNQUFNLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL3NjaGVtYXMvQ29tcGFueVNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZSgnLi4vLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvZGF0YWFjY2VzcycpO1xyXG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBDb21wYW55ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvQ29tcGFueScpO1xyXG5cclxubGV0IG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG5sZXQgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5cclxuY2xhc3MgQ29tcGFueVNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcblxyXG4gICAgbGV0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xyXG5cclxuICAgICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBhZGRyZXNzOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHVzZXJzOiBbe3R5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnVXNlcid9XSxcclxuICAgICAgcHJvamVjdHM6IFt7dHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdQcm9qZWN0J31dLFxyXG4gICAgICBzdWJzY3JpcHRpb246IHt0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1N1YnNjcmlwdGlvbid9LFxyXG4gICAgICBkYXRlT2ZTdWJzY3JpcHRpb246IHtcclxuICAgICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgIHtcclxuICAgICAgIHZlcnNpb25LZXk6IGZhbHNlLFxyXG4gICAgICAgdGltZXN0YW1wczp0cnVlXHJcbiAgICAgfSk7XHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG5sZXQgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPENvbXBhbnk+KCdDb21wYW55JywgQ29tcGFueVNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
