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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxnRUFBbUU7QUFDbkUsdURBQTBEO0FBRTFEO0lBQW1DLHdDQUFvQjtJQUNyRDtlQUNFLGtCQUFNLGdCQUFnQixDQUFDO0lBQ3pCLENBQUM7SUFDSCwyQkFBQztBQUFELENBSkEsQUFJQyxDQUprQyxjQUFjLEdBSWhEO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xDLGlCQUFTLG9CQUFvQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlciA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS91c2VyXCIpO1xyXG5pbXBvcnQgSm9iUHJvZmlsZVNjaGVtYSA9IHJlcXVpcmUoXCIuLi9zY2hlbWFzL2pvYi1wcm9maWxlLnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcblxyXG5jbGFzcyBKb2JQcm9maWxlUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPFVzZXI+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKEpvYlByb2ZpbGVTY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChKb2JQcm9maWxlUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IEpvYlByb2ZpbGVSZXBvc2l0b3J5O1xyXG4iXX0=
