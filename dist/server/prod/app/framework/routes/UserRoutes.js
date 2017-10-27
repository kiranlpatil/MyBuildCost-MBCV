"use strict";
var express = require("express");
var router = express.Router();
var UserRoutes = (function () {
    function UserRoutes() {
    }
    Object.defineProperty(UserRoutes.prototype, "routes", {
        get: function () {
            router.post("login", function (req, res) {
                console.log("serving request");
                res.status(200).send({ message: "done" });
            });
            return router;
        },
        enumerable: true,
        configurable: true
    });
    return UserRoutes;
}());
Object.seal(UserRoutes);
module.exports = UserRoutes;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcm91dGVzL1VzZXJSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLGlDQUFtQztBQUduQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUI7SUFHRTtJQUVBLENBQUM7SUFFRCxzQkFBSSw4QkFBTTthQUFWO1lBRUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRztnQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUdILGlCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEIsaUJBQVMsVUFBVSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvcm91dGVzL1VzZXJSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSBjaGV0YW4gb24gMjEvMTEvMTYuXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcblxyXG5cclxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcbmNsYXNzIFVzZXJSb3V0ZXMge1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0IHJvdXRlcygpIHtcclxuXHJcbiAgICByb3V0ZXIucG9zdChcImxvZ2luXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xyXG4gICAgICBjb25zb2xlLmxvZyhcInNlcnZpbmcgcmVxdWVzdFwiKTtcclxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe21lc3NhZ2U6IFwiZG9uZVwifSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByb3V0ZXI7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFVzZXJSb3V0ZXMpO1xyXG5leHBvcnQgPSBVc2VyUm91dGVzO1xyXG4iXX0=
