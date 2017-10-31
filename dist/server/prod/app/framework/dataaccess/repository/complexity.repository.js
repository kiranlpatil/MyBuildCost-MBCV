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
var ComplexitySchema = require("../schemas/complexity.schema");
var RepositoryBase = require("./base/repository.base");
var ComplexityRepository = (function (_super) {
    __extends(ComplexityRepository, _super);
    function ComplexityRepository() {
        return _super.call(this, ComplexitySchema) || this;
    }
    return ComplexityRepository;
}(RepositoryBase));
Object.seal(ComplexityRepository);
module.exports = ComplexityRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NvbXBsZXhpdHkucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtEQUFrRTtBQUNsRSx1REFBMEQ7QUFHMUQ7SUFBbUMsd0NBQTJCO0lBQzVEO2VBQ0Usa0JBQU0sZ0JBQWdCLENBQUM7SUFDekIsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FKQSxBQUlDLENBSmtDLGNBQWMsR0FJaEQ7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbEMsaUJBQVMsb0JBQW9CLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY29tcGxleGl0eS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbXBsZXhpdHlTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9jb21wbGV4aXR5LnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcbmltcG9ydCBJQ29tcGxleGl0eSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jb21wbGV4aXR5XCIpO1xyXG5cclxuY2xhc3MgQ29tcGxleGl0eVJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJQ29tcGxleGl0eT4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoQ29tcGxleGl0eVNjaGVtYSk7XHJcbiAgfVxyXG59XHJcbk9iamVjdC5zZWFsKENvbXBsZXhpdHlSZXBvc2l0b3J5KTtcclxuZXhwb3J0ID0gQ29tcGxleGl0eVJlcG9zaXRvcnk7XHJcbiJdfQ==
