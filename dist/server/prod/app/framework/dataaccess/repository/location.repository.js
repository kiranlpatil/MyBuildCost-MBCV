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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2xvY2F0aW9uLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBRzFEO0lBQWlDLHNDQUF5QjtJQUN4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUpBLEFBSUMsQ0FKZ0MsY0FBYyxHQUk5QztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9sb2NhdGlvbi5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvY2F0aW9uU2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvbG9jYXRpb24uc2NoZW1hXCIpO1xuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XG5pbXBvcnQgSUxvY2F0aW9uID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2xvY2F0aW9uXCIpO1xuXG5jbGFzcyBMb2NhdGlvblJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJTG9jYXRpb24+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoTG9jYXRpb25TY2hlbWEpO1xuICB9XG59XG5PYmplY3Quc2VhbChMb2NhdGlvblJlcG9zaXRvcnkpO1xuZXhwb3J0ID0gTG9jYXRpb25SZXBvc2l0b3J5O1xuIl19
