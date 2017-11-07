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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcm91dGVzL1VzZXJSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLGlDQUFtQztBQUduQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUI7SUFHRTtJQUVBLENBQUM7SUFFRCxzQkFBSSw4QkFBTTthQUFWO1lBRUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRztnQkFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUdILGlCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEIsaUJBQVMsVUFBVSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvcm91dGVzL1VzZXJSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgY2hldGFuIG9uIDIxLzExLzE2LlxuICovXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5cblxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5jbGFzcyBVc2VyUm91dGVzIHtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBnZXQgcm91dGVzKCkge1xuXG4gICAgcm91dGVyLnBvc3QoXCJsb2dpblwiLCBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic2VydmluZyByZXF1ZXN0XCIpO1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe21lc3NhZ2U6IFwiZG9uZVwifSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfVxuXG5cbn1cblxuT2JqZWN0LnNlYWwoVXNlclJvdXRlcyk7XG5leHBvcnQgPSBVc2VyUm91dGVzO1xuIl19
