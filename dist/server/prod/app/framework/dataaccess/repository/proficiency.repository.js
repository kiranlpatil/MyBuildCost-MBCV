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
var ProficiencySchema = require("../schemas/proficiency.schema");
var RepositoryBase = require("./base/repository.base");
var ProficiencyRepository = (function (_super) {
    __extends(ProficiencyRepository, _super);
    function ProficiencyRepository() {
        return _super.call(this, ProficiencySchema) || this;
    }
    return ProficiencyRepository;
}(RepositoryBase));
Object.seal(ProficiencyRepository);
module.exports = ProficiencyRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3Byb2ZpY2llbmN5LnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxpRUFBb0U7QUFDcEUsdURBQTBEO0FBRzFEO0lBQW9DLHlDQUE0QjtJQUM5RDtlQUNFLGtCQUFNLGlCQUFpQixDQUFDO0lBQzFCLENBQUM7SUFDSCw0QkFBQztBQUFELENBSkEsQUFJQyxDQUptQyxjQUFjLEdBSWpEO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25DLGlCQUFTLHFCQUFxQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3Byb2ZpY2llbmN5LnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZmljaWVuY3lTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9wcm9maWNpZW5jeS5zY2hlbWFcIik7XHJcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xyXG5pbXBvcnQgSVByb2ZpY2llbmN5ID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3Byb2ZpY2llbmN5XCIpO1xyXG5cclxuY2xhc3MgUHJvZmljaWVuY3lSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SVByb2ZpY2llbmN5PiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihQcm9maWNpZW5jeVNjaGVtYSk7XHJcbiAgfVxyXG59XHJcbk9iamVjdC5zZWFsKFByb2ZpY2llbmN5UmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IFByb2ZpY2llbmN5UmVwb3NpdG9yeTtcclxuIl19
