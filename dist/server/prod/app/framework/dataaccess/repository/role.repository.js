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
var RoleSchema = require("../schemas/role.schema");
var RepositoryBase = require("./base/repository.base");
var RoleRepository = (function (_super) {
    __extends(RoleRepository, _super);
    function RoleRepository() {
        return _super.call(this, RoleSchema) || this;
    }
    return RoleRepository;
}(RepositoryBase));
Object.seal(RoleRepository);
module.exports = RoleRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JvbGUucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1EQUFzRDtBQUN0RCx1REFBMEQ7QUFHMUQ7SUFBNkIsa0NBQXFCO0lBQ2hEO2VBQ0Usa0JBQU0sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFDSCxxQkFBQztBQUFELENBSkEsQUFJQyxDQUo0QixjQUFjLEdBSTFDO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QixpQkFBUyxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcm9sZS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJvbGVTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9yb2xlLnNjaGVtYVwiKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xuaW1wb3J0IElSb2xlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3JvbGVcIik7XG5cbmNsYXNzIFJvbGVSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SVJvbGU+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoUm9sZVNjaGVtYSk7XG4gIH1cbn1cbk9iamVjdC5zZWFsKFJvbGVSZXBvc2l0b3J5KTtcbmV4cG9ydCA9IFJvbGVSZXBvc2l0b3J5O1xuIl19
