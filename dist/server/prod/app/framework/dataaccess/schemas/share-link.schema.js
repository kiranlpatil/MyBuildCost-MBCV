"use strict";
var DataAccess = require("../dataaccess");
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;
var ShareLinkSchema = (function () {
    function ShareLinkSchema() {
    }
    Object.defineProperty(ShareLinkSchema, "schema", {
        get: function () {
            var schema = mongoose.Schema({
                shortUrl: {
                    type: String,
                    unique: true
                },
                longUrl: {
                    type: String
                }
            }, { versionKey: false });
            return schema;
        },
        enumerable: true,
        configurable: true
    });
    return ShareLinkSchema;
}());
var schema = mongooseConnection.model("ShareLink", ShareLinkSchema.schema);
module.exports = schema;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3NoYXJlLWxpbmsuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQ0FBNkM7QUFFN0MsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDO0FBQzNDLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO0FBRXZEO0lBQUE7SUFhQSxDQUFDO0lBWkMsc0JBQVcseUJBQU07YUFBakI7WUFDRSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMzQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07b0JBQ1osTUFBTSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxNQUFNO2lCQUNiO2FBQ0YsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFDSCxzQkFBQztBQUFELENBYkEsQUFhQyxJQUFBO0FBQ0QsSUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFZLFdBQVcsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEYsaUJBQVMsTUFBTSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9zY2hlbWFzL3NoYXJlLWxpbmsuc2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERhdGFBY2Nlc3MgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzc1wiKTtcbmltcG9ydCBTaGFyZUxpbmsgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2Uvc2hhcmUtbGlua1wiKTtcbnZhciBtb25nb29zZSA9IERhdGFBY2Nlc3MubW9uZ29vc2VJbnN0YW5jZTtcbnZhciBtb25nb29zZUNvbm5lY3Rpb24gPSBEYXRhQWNjZXNzLm1vbmdvb3NlQ29ubmVjdGlvbjtcblxuY2xhc3MgU2hhcmVMaW5rU2NoZW1hIHtcbiAgc3RhdGljIGdldCBzY2hlbWEoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYSh7XG4gICAgICBzaG9ydFVybDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHVuaXF1ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGxvbmdVcmw6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICB9XG4gICAgfSwge3ZlcnNpb25LZXk6IGZhbHNlfSk7XG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxufVxudmFyIHNjaGVtYSA9IG1vbmdvb3NlQ29ubmVjdGlvbi5tb2RlbDxTaGFyZUxpbms+KFwiU2hhcmVMaW5rXCIsIFNoYXJlTGlua1NjaGVtYS5zY2hlbWEpO1xuZXhwb3J0ID0gc2NoZW1hO1xuIl19
