"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var CompanySchema = (function () {
    function CompanySchema() {
    }
    Object.defineProperty(CompanySchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                schoolName: {
                    type: String
                },
                board: {
                    type: String
                },
                yearOfPassing: {
                    type: Number
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
    return CompanySchema;
}());
var schema = mongooseConnection.model("Location", CompanySchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBhbnkuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFJN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFvQkEsQ0FBQztJQW5CQyxzQkFBVyx1QkFBTTthQUFqQjtZQUNFLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLFVBQVUsRUFBRTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLE1BQU07aUJBQ2I7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNELGNBQWMsRUFBRTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtpQkFDYjthQUVGLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0gsb0JBQUM7QUFBRCxDQXBCQSxBQW9CQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFXLFVBQVUsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL2NvbXBhbnkuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBJQWNhZGVtaWMgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvYWNhZGVtaWNzXCIpO1xuaW1wb3J0IElDb21wYW55ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2NvbXBhbnlcIik7XG5cbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgQ29tcGFueVNjaGVtYSB7XG4gIHN0YXRpYyBnZXQgc2NoZW1hKCkge1xuICAgIHZhciBzY2hlbWEgPSBtb25nb29zZS5TY2hlbWEoe1xuICAgICAgc2Nob29sTmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICBib2FyZDoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgIH0sXG4gICAgICB5ZWFyT2ZQYXNzaW5nOiB7XG4gICAgICAgIHR5cGU6IE51bWJlclxuICAgICAgfSxcbiAgICAgIHNwZWNpYWxpemF0aW9uOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfVxuXG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG5cbiAgICByZXR1cm4gc2NoZW1hO1xuICB9XG59XG52YXIgc2NoZW1hID0gbW9uZ29vc2VDb25uZWN0aW9uLm1vZGVsPElDb21wYW55PihcIkxvY2F0aW9uXCIsIENvbXBhbnlTY2hlbWEuc2NoZW1hKTtcbmV4cG9ydCA9IHNjaGVtYTtcbiJdfQ==
