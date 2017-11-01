"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var AcademicSchema = (function () {
    function AcademicSchema() {
    }
    Object.defineProperty(AcademicSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                schoolName: {
                    type: String
                },
                board: {
                    type: String
                },
                yearOfPassing: {
                    type: String
                },
                specialization: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return AcademicSchema;
}());
var schema = mongooseConnection.model('Academic', AcademicSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2FjYWRlbWljLnNjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMENBQTZDO0FBRzdDLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztBQUMzQyxJQUFJLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztBQUV2RDtJQUFBO0lBb0JBLENBQUM7SUFuQkMsc0JBQVcsd0JBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLE1BQU07aUJBQ2I7YUFFRixFQUFFLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNILHFCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQUNELElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBWSxVQUFVLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BGLGlCQUFTLE1BQU0sQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3Mvc2NoZW1hcy9hY2FkZW1pYy5zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGF0YUFjY2VzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MnKTtcclxuaW1wb3J0IElBY2FkZW1pYyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2FjYWRlbWljcycpO1xyXG5cclxudmFyIG1vbmdvb3NlID0gRGF0YUFjY2Vzcy5tb25nb29zZUluc3RhbmNlO1xyXG52YXIgbW9uZ29vc2VDb25uZWN0aW9uID0gRGF0YUFjY2Vzcy5tb25nb29zZUNvbm5lY3Rpb247XHJcblxyXG5jbGFzcyBBY2FkZW1pY1NjaGVtYSB7XHJcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XHJcbiAgICB2YXIgc2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgICAgc2Nob29sTmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICBib2FyZDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgICB9LFxyXG4gICAgICB5ZWFyT2ZQYXNzaW5nOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHNwZWNpYWxpemF0aW9uOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCB7dmVyc2lvbktleTogZmFsc2V9KTtcclxuXHJcbiAgICByZXR1cm4gc2NoZW1hO1xyXG4gIH1cclxufVxyXG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElBY2FkZW1pYz4oJ0FjYWRlbWljJywgQWNhZGVtaWNTY2hlbWEuc2NoZW1hKTtcclxuZXhwb3J0ID0gc2NoZW1hO1xyXG4iXX0=
