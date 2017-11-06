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
var AdminSchema = require("../schemas/admin.schema");
var RepositoryBase = require("./base/repository.base");
var AdminRepository = (function (_super) {
    __extends(AdminRepository, _super);
    function AdminRepository() {
        return _super.call(this, AdminSchema) || this;
    }
    return AdminRepository;
}(RepositoryBase));
Object.seal(AdminRepository);
module.exports = AdminRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2FkbWluLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxREFBd0Q7QUFDeEQsdURBQTBEO0FBSTFEO0lBQThCLG1DQUFzQjtJQUNsRDtlQUNFLGtCQUFNLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUpBLEFBSUMsQ0FKNkIsY0FBYyxHQUkzQztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2FkbWluLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWRtaW5TY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9hZG1pbi5zY2hlbWFcIik7XG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKFwiLi9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcbmltcG9ydCBDYW5kaWRhdGUgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FuZGlkYXRlXCIpO1xuaW1wb3J0IElBZG1pbiA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9hZG1pblwiKTtcblxuY2xhc3MgQWRtaW5SZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUFkbWluPiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFkbWluU2NoZW1hKTtcbiAgfVxufVxuT2JqZWN0LnNlYWwoQWRtaW5SZXBvc2l0b3J5KTtcbmV4cG9ydCA9IEFkbWluUmVwb3NpdG9yeTtcbiJdfQ==
