"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var CapabilitySchema = (function () {
    function CapabilitySchema() {
    }
    Object.defineProperty(CapabilitySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                },
                complexities: [{
                        type: mongoose.Schema.Types.ObjectId, ref: 'IComplexity'
                    }],
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return CapabilitySchema;
}());
var schema = mongooseConnection.model("Capability", CapabilitySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhcGFiaWxpdHkuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFJN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFjQSxDQUFDO0lBYkMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFLENBQUM7d0JBQ2IsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsYUFBYTtxQkFDekQsQ0FBQzthQUVILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQWRBLEFBY0MsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NhcGFiaWxpdHkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBJQ2FwYWJpbGl0eSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYXBhYmlsaXR5XCIpO1xuaW1wb3J0IElDb21wbGV4aXR5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2NvbXBsZXhpdHlcIik7XG5cbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgQ2FwYWJpbGl0eVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xuICAgICAgbmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBjb21wbGV4aXRpZXM6IFt7XG4gICAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnSUNvbXBsZXhpdHknXG4gICAgICB9XSxcblxuICAgIH0sIHt2ZXJzaW9uS2V5OiBmYWxzZX0pO1xuXG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxufVxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJQ2FwYWJpbGl0eT4oXCJDYXBhYmlsaXR5XCIsIENhcGFiaWxpdHlTY2hlbWEuc2NoZW1hKTtcbmV4cG9ydCA9IHNjaGVtYTtcbiJdfQ==
