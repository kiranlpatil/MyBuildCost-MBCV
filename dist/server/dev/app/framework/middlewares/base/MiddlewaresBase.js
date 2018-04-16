"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var MethodOverride = require("./../MethodOverride");
var BaseRoutes = require("./../../routes/base/BaseRoutes");
var MiddlewaresBase = (function () {
    function MiddlewaresBase() {
    }
    Object.defineProperty(MiddlewaresBase, "configuration", {
        get: function () {
            var app = express();
            app.use(bodyParser.json({ limit: '50mb' }));
            app.use(MethodOverride.configuration());
            app.use(new BaseRoutes().routes);
            return app;
        },
        enumerable: true,
        configurable: true
    });
    return MiddlewaresBase;
}());
Object.seal(MiddlewaresBase);
module.exports = MiddlewaresBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbWlkZGxld2FyZXMvYmFzZS9NaWRkbGV3YXJlc0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlDQUFvQztBQUNwQyx3Q0FBMkM7QUFFM0Msb0RBQXVEO0FBQ3ZELDJEQUE4RDtBQUc5RDtJQUFBO0lBVUEsQ0FBQztJQVJHLHNCQUFXLGdDQUFhO2FBQXhCO1lBQ0ssSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVqQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBQ0wsc0JBQUM7QUFBRCxDQVZBLEFBVUMsSUFBQTtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvbWlkZGxld2FyZXMvYmFzZS9NaWRkbGV3YXJlc0Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuaW1wb3J0IGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xyXG5cclxuaW1wb3J0IE1ldGhvZE92ZXJyaWRlID0gcmVxdWlyZSgnLi8uLi9NZXRob2RPdmVycmlkZScpO1xyXG5pbXBvcnQgQmFzZVJvdXRlcyA9IHJlcXVpcmUoJy4vLi4vLi4vcm91dGVzL2Jhc2UvQmFzZVJvdXRlcycpO1xyXG5cclxuXHJcbmNsYXNzIE1pZGRsZXdhcmVzQmFzZSB7XHJcblxyXG4gICAgc3RhdGljIGdldCBjb25maWd1cmF0aW9uICgpIHtcclxuICAgICAgICAgdmFyIGFwcCA9IGV4cHJlc3MoKTtcclxuICAgICAgICAgYXBwLnVzZShib2R5UGFyc2VyLmpzb24oe2xpbWl0Oic1MG1iJ30pKTtcclxuICAgICAgICAgYXBwLnVzZShNZXRob2RPdmVycmlkZS5jb25maWd1cmF0aW9uKCkpO1xyXG4gICAgICAgICBhcHAudXNlKG5ldyBCYXNlUm91dGVzKCkucm91dGVzKTtcclxuXHJcbiAgICAgICAgIHJldHVybiBhcHA7XHJcbiAgICB9XHJcbn1cclxuT2JqZWN0LnNlYWwoTWlkZGxld2FyZXNCYXNlKTtcclxuZXhwb3J0ID0gTWlkZGxld2FyZXNCYXNlO1xyXG4iXX0=
