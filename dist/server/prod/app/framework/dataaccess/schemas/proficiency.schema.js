"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ProficiencySchema = (function () {
    function ProficiencySchema() {
    }
    Object.defineProperty(ProficiencySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                proficiencies: {
                    type: [String]
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ProficiencySchema;
}());
var schema = mongooseConnection.model("Proficiency", ProficiencySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2ZpY2llbmN5LnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBRzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBYUEsQ0FBQztJQVpDLHNCQUFXLDJCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFJM0IsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDZjthQUNGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsd0JBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBZSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0YsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2ZpY2llbmN5LnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XHJcbmltcG9ydCBJUHJvZmljaWVuY3kgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvcHJvZmljaWVuY3lcIik7XHJcblxyXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XHJcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcclxuXHJcbmNsYXNzIFByb2ZpY2llbmN5U2NoZW1hIHtcclxuICBzdGF0aWMgZ2V0IHNjaGVtYSgpIHtcclxuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgICAvKm5hbWUgOntcclxuICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICAgfSwqL1xyXG4gICAgICBwcm9maWNpZW5jaWVzOiB7XHJcbiAgICAgICAgdHlwZTogW1N0cmluZ11cclxuICAgICAgfVxyXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYTtcclxuICB9XHJcbn1cclxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxJUHJvZmljaWVuY3k+KFwiUHJvZmljaWVuY3lcIiwgUHJvZmljaWVuY3lTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
