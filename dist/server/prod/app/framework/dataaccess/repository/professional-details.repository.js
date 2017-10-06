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
var ProfessionalDetailsSchema = require("../schemas/professional-details.schema");
var RepositoryBase = require("./base/repository.base");
var ProfessionalDetailsRepository = (function (_super) {
    __extends(ProfessionalDetailsRepository, _super);
    function ProfessionalDetailsRepository() {
        return _super.call(this, ProfessionalDetailsSchema) || this;
    }
    return ProfessionalDetailsRepository;
}(RepositoryBase));
Object.seal(ProfessionalDetailsRepository);
module.exports = ProfessionalDetailsRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3Byb2Zlc3Npb25hbC1kZXRhaWxzLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxrRkFBcUY7QUFDckYsdURBQTBEO0FBRzFEO0lBQTRDLGlEQUFvQztJQUM5RTtlQUNFLGtCQUFNLHlCQUF5QixDQUFDO0lBQ2xDLENBQUM7SUFDSCxvQ0FBQztBQUFELENBSkEsQUFJQyxDQUoyQyxjQUFjLEdBSXpEO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNDLGlCQUFTLDZCQUE2QixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3Byb2Zlc3Npb25hbC1kZXRhaWxzLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZmVzc2lvbmFsRGV0YWlsc1NjaGVtYSA9IHJlcXVpcmUoXCIuLi9zY2hlbWFzL3Byb2Zlc3Npb25hbC1kZXRhaWxzLnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcbmltcG9ydCBJUHJvZmVzc2lvbmFsRGV0YWlscyA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9wcm9mZXNzaW9uYWwtZGV0YWlsc1wiKTtcclxuXHJcbmNsYXNzIFByb2Zlc3Npb25hbERldGFpbHNSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SVByb2Zlc3Npb25hbERldGFpbHM+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFByb2Zlc3Npb25hbERldGFpbHNTY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChQcm9mZXNzaW9uYWxEZXRhaWxzUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IFByb2Zlc3Npb25hbERldGFpbHNSZXBvc2l0b3J5O1xyXG4iXX0=
