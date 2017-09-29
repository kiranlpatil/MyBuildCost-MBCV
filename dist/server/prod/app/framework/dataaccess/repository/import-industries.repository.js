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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2ltcG9ydC1pbmR1c3RyaWVzLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSx3RUFBMkU7QUFDM0UsdURBQTBEO0FBSTFEO0lBQWlDLHNDQUErQjtJQUU5RDtlQUNFLGtCQUFNLG9CQUFvQixDQUFDO0lBQzdCLENBQUM7SUFFSCx5QkFBQztBQUFELENBTkEsQUFNQyxDQU5nQyxjQUFjLEdBTTlDO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFTLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2ltcG9ydC1pbmR1c3RyaWVzLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDcvMTEvMjAxNy5cbiAqL1xuaW1wb3J0IEltcG9ydEluZHVzdHJ5U2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvaW1wb3J0LWluZHVzdHJ5LnNjaGVtYVwiKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xuaW1wb3J0IElJbXBvcnRJbmR1c3RyeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9pbXBvcnQtaW5kdXN0cnlcIik7XG5cblxuY2xhc3MgSW5kdXN0cnlSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUltcG9ydEluZHVzdHJ5PiB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoSW1wb3J0SW5kdXN0cnlTY2hlbWEpO1xuICB9XG5cbn1cbk9iamVjdC5zZWFsKEluZHVzdHJ5UmVwb3NpdG9yeSk7XG5leHBvcnQgPSBJbmR1c3RyeVJlcG9zaXRvcnk7XG4iXX0=
