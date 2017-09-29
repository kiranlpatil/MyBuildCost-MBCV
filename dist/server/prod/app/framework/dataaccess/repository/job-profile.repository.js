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
var JobProfileSchema = require("../schemas/job-profile.schema");
var RepositoryBase = require("./base/repository.base");
var JobProfileRepository = (function (_super) {
    __extends(JobProfileRepository, _super);
    function JobProfileRepository() {
        return _super.call(this, JobProfileSchema) || this;
    }
    return JobProfileRepository;
}(RepositoryBase));
Object.seal(JobProfileRepository);
module.exports = JobProfileRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxnRUFBbUU7QUFDbkUsdURBQTBEO0FBRTFEO0lBQW1DLHdDQUFvQjtJQUNyRDtlQUNFLGtCQUFNLGdCQUFnQixDQUFDO0lBQ3pCLENBQUM7SUFDSCwyQkFBQztBQUFELENBSkEsQUFJQyxDQUprQyxjQUFjLEdBSWhEO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xDLGlCQUFTLG9CQUFvQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlciA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS91c2VyXCIpO1xuaW1wb3J0IEpvYlByb2ZpbGVTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9qb2ItcHJvZmlsZS5zY2hlbWFcIik7XG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKFwiLi9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcblxuY2xhc3MgSm9iUHJvZmlsZVJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxVc2VyPiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEpvYlByb2ZpbGVTY2hlbWEpO1xuICB9XG59XG5PYmplY3Quc2VhbChKb2JQcm9maWxlUmVwb3NpdG9yeSk7XG5leHBvcnQgPSBKb2JQcm9maWxlUmVwb3NpdG9yeTtcbiJdfQ==
