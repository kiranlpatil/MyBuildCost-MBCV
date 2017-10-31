"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var DomainSchema = (function () {
    function DomainSchema() {
    }
    Object.defineProperty(DomainSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                },
                roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IRole' }]
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return DomainSchema;
}());
var schema = mongooseConnection.model("Domain", DomainSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2RvbWFpbi5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUE2QztBQU03QyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDM0MsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFFdkQ7SUFBQTtJQVlBLENBQUM7SUFYQyxzQkFBVyxzQkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDO2FBRTlELEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsbUJBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBVSxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlFLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9kb21haW4uc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcclxuaW1wb3J0IElTY2VuYXJpbyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9zY2VuYXJpb1wiKTtcclxuaW1wb3J0IElSb2xlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3JvbGVcIik7XHJcbmltcG9ydCBJSW5kdXN0cnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvaW5kdXN0cnlcIik7XHJcbmltcG9ydCBJRG9tYWluID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2RvbWFpblwiKTtcclxuXHJcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcclxudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xyXG5cclxuY2xhc3MgRG9tYWluU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICBuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvbGVzOiBbe3R5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnSVJvbGUnfV1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElEb21haW4+KFwiRG9tYWluXCIsIERvbWFpblNjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
