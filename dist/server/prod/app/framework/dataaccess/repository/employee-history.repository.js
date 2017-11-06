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
var EmploymentHistorySchema = require("../schemas/employment-history.schema");
var RepositoryBase = require("./base/repository.base");
var EmployeeHistoryRepository = (function (_super) {
    __extends(EmployeeHistoryRepository, _super);
    function EmployeeHistoryRepository() {
        return _super.call(this, EmploymentHistorySchema) || this;
    }
    return EmployeeHistoryRepository;
}(RepositoryBase));
Object.seal(EmployeeHistoryRepository);
module.exports = EmployeeHistoryRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2VtcGxveWVlLWhpc3RvcnkucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDhFQUFpRjtBQUNqRix1REFBMEQ7QUFHMUQ7SUFBd0MsNkNBQWtDO0lBQ3hFO2VBQ0Usa0JBQU0sdUJBQXVCLENBQUM7SUFDaEMsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FKQSxBQUlDLENBSnVDLGNBQWMsR0FJckQ7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkMsaUJBQVMseUJBQXlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvZW1wbG95ZWUtaGlzdG9yeS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGxveW1lbnRIaXN0b3J5U2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvZW1wbG95bWVudC1oaXN0b3J5LnNjaGVtYVwiKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xuaW1wb3J0IElFbXBsb3ltZW50SGlzdG9yeSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9lbXBsb3ltZW50LWhpc3RvcnlcIik7XG5cbmNsYXNzIEVtcGxveWVlSGlzdG9yeVJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJRW1wbG95bWVudEhpc3Rvcnk+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoRW1wbG95bWVudEhpc3RvcnlTY2hlbWEpO1xuICB9XG59XG5PYmplY3Quc2VhbChFbXBsb3llZUhpc3RvcnlSZXBvc2l0b3J5KTtcbmV4cG9ydCA9IEVtcGxveWVlSGlzdG9yeVJlcG9zaXRvcnk7XG4iXX0=
