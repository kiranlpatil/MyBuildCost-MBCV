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
var AcademicSchema = require("../schemas/academic.schema");
var RepositoryBase = require("./base/repository.base");
var AcademicsRepository = (function (_super) {
    __extends(AcademicsRepository, _super);
    function AcademicsRepository() {
        return _super.call(this, AcademicSchema) || this;
    }
    return AcademicsRepository;
}(RepositoryBase));
Object.seal(AcademicsRepository);
module.exports = AcademicsRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2FjYWRlbWljcy5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsMkRBQThEO0FBQzlELHVEQUEwRDtBQUcxRDtJQUFrQyx1Q0FBeUI7SUFDekQ7ZUFDRSxrQkFBTSxjQUFjLENBQUM7SUFDdkIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FKQSxBQUlDLENBSmlDLGNBQWMsR0FJL0M7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakMsaUJBQVMsbUJBQW1CLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvYWNhZGVtaWNzLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWNhZGVtaWNTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL2FjYWRlbWljLnNjaGVtYScpO1xyXG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKCcuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlJyk7XHJcbmltcG9ydCBJQWNhZGVtaWMgPSByZXF1aXJlKCcuLi9tb25nb29zZS9hY2FkZW1pY3MnKTtcclxuXHJcbmNsYXNzIEFjYWRlbWljc1JlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJQWNhZGVtaWM+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKEFjYWRlbWljU2NoZW1hKTtcclxuICB9XHJcbn1cclxuT2JqZWN0LnNlYWwoQWNhZGVtaWNzUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IEFjYWRlbWljc1JlcG9zaXRvcnk7XHJcbiJdfQ==
