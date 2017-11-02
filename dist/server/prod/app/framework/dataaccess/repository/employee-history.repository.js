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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2VtcGxveWVlLWhpc3RvcnkucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDhFQUFpRjtBQUNqRix1REFBMEQ7QUFHMUQ7SUFBd0MsNkNBQWtDO0lBQ3hFO2VBQ0Usa0JBQU0sdUJBQXVCLENBQUM7SUFDaEMsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FKQSxBQUlDLENBSnVDLGNBQWMsR0FJckQ7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkMsaUJBQVMseUJBQXlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvZW1wbG95ZWUtaGlzdG9yeS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGxveW1lbnRIaXN0b3J5U2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvZW1wbG95bWVudC1oaXN0b3J5LnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcbmltcG9ydCBJRW1wbG95bWVudEhpc3RvcnkgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvZW1wbG95bWVudC1oaXN0b3J5XCIpO1xyXG5cclxuY2xhc3MgRW1wbG95ZWVIaXN0b3J5UmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElFbXBsb3ltZW50SGlzdG9yeT4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoRW1wbG95bWVudEhpc3RvcnlTY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChFbXBsb3llZUhpc3RvcnlSZXBvc2l0b3J5KTtcclxuZXhwb3J0ID0gRW1wbG95ZWVIaXN0b3J5UmVwb3NpdG9yeTtcclxuIl19
