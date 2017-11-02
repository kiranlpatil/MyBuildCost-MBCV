"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var RoleSchema = (function () {
    function RoleSchema() {
    }
    Object.defineProperty(RoleSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                },
                capabilities: [{
                        type: mongoose.Schema.Types.ObjectId, ref: 'ICapability'
                    }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return RoleSchema;
}());
var schema = mongooseConnection.model("Role", RoleSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3JvbGUuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFJN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFjQSxDQUFDO0lBYkMsc0JBQVcsb0JBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFLENBQUM7d0JBQ2IsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsYUFBYTtxQkFDekQsQ0FBQzthQUVILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsaUJBQUM7QUFBRCxDQWRBLEFBY0MsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBUSxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hFLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9yb2xlLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XHJcbmltcG9ydCBJUm9sZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9yb2xlXCIpO1xyXG5pbXBvcnQgSUNhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FwYWJpbGl0eVwiKTtcclxuXHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgUm9sZVNjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICB2YXIgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgbmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBjYXBhYmlsaXRpZXM6IFt7XHJcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdJQ2FwYWJpbGl0eSdcclxuICAgICAgfV1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElSb2xlPihcIlJvbGVcIiwgUm9sZVNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
