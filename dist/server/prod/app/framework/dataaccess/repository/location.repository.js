"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LocationSchema = require("../schemas/location.schema");
var RepositoryBase = require("./base/repository.base");
var LocationRepository = (function (_super) {
    __extends(LocationRepository, _super);
    function LocationRepository() {
        return _super.call(this, LocationSchema) || this;
    }
    return LocationRepository;
}(RepositoryBase));
Object.seal(LocationRepository);
module.exports = LocationRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2xvY2F0aW9uLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBRzFEO0lBQWlDLHNDQUF5QjtJQUN4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUpBLEFBSUMsQ0FKZ0MsY0FBYyxHQUk5QztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9sb2NhdGlvbi5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvY2F0aW9uU2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvbG9jYXRpb24uc2NoZW1hXCIpO1xyXG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKFwiLi9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcclxuaW1wb3J0IElMb2NhdGlvbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9sb2NhdGlvblwiKTtcclxuXHJcbmNsYXNzIExvY2F0aW9uUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElMb2NhdGlvbj4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoTG9jYXRpb25TY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChMb2NhdGlvblJlcG9zaXRvcnkpO1xyXG5leHBvcnQgPSBMb2NhdGlvblJlcG9zaXRvcnk7XHJcbiJdfQ==
