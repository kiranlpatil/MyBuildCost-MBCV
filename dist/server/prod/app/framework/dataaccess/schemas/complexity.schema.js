"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ComplexitySchema = (function () {
    function ComplexitySchema() {
    }
    Object.defineProperty(ComplexitySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                },
                scenarios: [{
                        type: String
                    }],
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ComplexitySchema;
}());
var schema = mongooseConnection.model("Complexity", ComplexitySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBsZXhpdHkuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFJN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFlQSxDQUFDO0lBZEMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUM7d0JBQ1YsSUFBSSxFQUFFLE1BQU07cUJBQ2IsQ0FBQzthQUdILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQWZBLEFBZUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBsZXhpdHkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcclxuaW1wb3J0IElDb21wbGV4aXR5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2NvbXBsZXhpdHlcIik7XHJcbmltcG9ydCBJU2NlbmFyaW8gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2Uvc2NlbmFyaW9cIik7XHJcblxyXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIENvbXBsZXhpdHlTY2hlbWEge1xyXG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xyXG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmdcclxuICAgICAgfSxcclxuICAgICAgc2NlbmFyaW9zOiBbe1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9XSxcclxuXHJcblxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJQ29tcGxleGl0eT4oXCJDb21wbGV4aXR5XCIsIENvbXBsZXhpdHlTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
