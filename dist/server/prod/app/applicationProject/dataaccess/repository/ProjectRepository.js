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
var ProjectSchema = require("../schemas/ProjectSchema");
var RepositoryBase = require("./../../../framework/dataaccess/repository/base/repository.base");
var ProjectRepository = (function (_super) {
    __extends(ProjectRepository, _super);
    function ProjectRepository() {
        return _super.call(this, ProjectSchema) || this;
    }
    return ProjectRepository;
}(RepositoryBase));
Object.seal(ProjectRepository);
module.exports = ProjectRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1Byb2plY3RSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0Esd0RBQTJEO0FBQzNELGdHQUFtRztBQUVuRztJQUFnQyxxQ0FBdUI7SUFDckQ7ZUFDRSxrQkFBTSxhQUFhLENBQUM7SUFDdEIsQ0FBQztJQUVILHdCQUFDO0FBQUQsQ0FMQSxBQUtDLENBTCtCLGNBQWMsR0FLN0M7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0IsaUJBQVMsaUJBQWlCLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvUHJvamVjdFJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvamVjdCA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL1Byb2plY3QnKTtcclxuaW1wb3J0IFByb2plY3RTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL1Byb2plY3RTY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2Jhc2UvcmVwb3NpdG9yeS5iYXNlJyk7XHJcblxyXG5jbGFzcyBQcm9qZWN0UmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPFByb2plY3Q+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFByb2plY3RTY2hlbWEpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFByb2plY3RSZXBvc2l0b3J5KTtcclxuZXhwb3J0ID0gUHJvamVjdFJlcG9zaXRvcnk7XHJcbiJdfQ==
