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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBsZXhpdHkuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFJN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFlQSxDQUFDO0lBZEMsc0JBQVcsMEJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsU0FBUyxFQUFFLENBQUM7d0JBQ1YsSUFBSSxFQUFFLE1BQU07cUJBQ2IsQ0FBQzthQUdILEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsdUJBQUM7QUFBRCxDQWZBLEFBZUMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBYyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBsZXhpdHkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBJQ29tcGxleGl0eSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jb21wbGV4aXR5XCIpO1xuaW1wb3J0IElTY2VuYXJpbyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9zY2VuYXJpb1wiKTtcblxudmFyIG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xudmFyIG1vbmdvb3NlQ29ubmVjdGlvbiA9IERhdGFBY2Nlc3MubW9uZ29vc2VDb25uZWN0aW9uO1xuXG5jbGFzcyBDb21wbGV4aXR5U2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIHNjZW5hcmlvczogW3tcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9XSxcblxuXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG59XG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElDb21wbGV4aXR5PihcIkNvbXBsZXhpdHlcIiwgQ29tcGxleGl0eVNjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
