"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ScenarioSchema = (function () {
    function ScenarioSchema() {
    }
    Object.defineProperty(ScenarioSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                name: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ScenarioSchema;
}());
var schema = mongooseConnection.model("Scenario", ScenarioSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3NjZW5hcmlvLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBRzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBV0EsQ0FBQztJQVZDLHNCQUFXLHdCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDM0IsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBRUYsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxxQkFBQztBQUFELENBWEEsQUFXQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFZLFVBQVUsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3NjZW5hcmlvLnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XHJcbmltcG9ydCBJU2NlbmFyaW8gPSByZXF1aXJlKFwiLi4vbW9uZ29vc2Uvc2NlbmFyaW9cIik7XHJcblxyXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIFNjZW5hcmlvU2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICBuYW1lOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElTY2VuYXJpbz4oXCJTY2VuYXJpb1wiLCBTY2VuYXJpb1NjaGVtYS5zY2hlbWEpO1xyXG5leHBvcnQgPSBzY2hlbWE7XHJcbiJdfQ==
