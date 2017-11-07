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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2ZpY2llbmN5LnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBRzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBYUEsQ0FBQztJQVpDLHNCQUFXLDJCQUFNO2FBQWpCO1lBQ0UsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFJM0IsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDZjthQUNGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsd0JBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBZSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0YsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3Byb2ZpY2llbmN5LnNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhQWNjZXNzID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3NcIik7XG5pbXBvcnQgSVByb2ZpY2llbmN5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3Byb2ZpY2llbmN5XCIpO1xuXG52YXIgbW9uZ29vc2UgPSBEYXRhQWNjZXNzLm1vbmdvb3NlSW5zdGFuY2U7XG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XG5cbmNsYXNzIFByb2ZpY2llbmN5U2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgICAvKm5hbWUgOntcbiAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICB9LCovXG4gICAgICBwcm9maWNpZW5jaWVzOiB7XG4gICAgICAgIHR5cGU6IFtTdHJpbmddXG4gICAgICB9XG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG59XG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElQcm9maWNpZW5jeT4oXCJQcm9maWNpZW5jeVwiLCBQcm9maWNpZW5jeVNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
