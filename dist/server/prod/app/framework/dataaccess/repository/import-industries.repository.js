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
var ImportIndustrySchema = require("../schemas/import-industry.schema");
var RepositoryBase = require("./base/repository.base");
var IndustryRepository = (function (_super) {
    __extends(IndustryRepository, _super);
    function IndustryRepository() {
        return _super.call(this, ImportIndustrySchema) || this;
    }
    return IndustryRepository;
}(RepositoryBase));
Object.seal(IndustryRepository);
module.exports = IndustryRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2ltcG9ydC1pbmR1c3RyaWVzLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSx3RUFBMkU7QUFDM0UsdURBQTBEO0FBSTFEO0lBQWlDLHNDQUErQjtJQUU5RDtlQUNFLGtCQUFNLG9CQUFvQixDQUFDO0lBQzdCLENBQUM7SUFFSCx5QkFBQztBQUFELENBTkEsQUFNQyxDQU5nQyxjQUFjLEdBTTlDO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFTLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2ltcG9ydC1pbmR1c3RyaWVzLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSB0ZWNocHJpbWUwMDIgb24gNy8xMS8yMDE3LlxyXG4gKi9cclxuaW1wb3J0IEltcG9ydEluZHVzdHJ5U2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvaW1wb3J0LWluZHVzdHJ5LnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcbmltcG9ydCBJSW1wb3J0SW5kdXN0cnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvaW1wb3J0LWluZHVzdHJ5XCIpO1xyXG5cclxuXHJcbmNsYXNzIEluZHVzdHJ5UmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElJbXBvcnRJbmR1c3RyeT4ge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKEltcG9ydEluZHVzdHJ5U2NoZW1hKTtcclxuICB9XHJcblxyXG59XHJcbk9iamVjdC5zZWFsKEluZHVzdHJ5UmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuIl19
