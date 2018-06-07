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
var BuildingSchema = require("../schemas/BuildingSchema");
var RepositoryBase = require("./../../../framework/dataaccess/repository/base/repository.base");
var BuildingRepository = (function (_super) {
    __extends(BuildingRepository, _super);
    function BuildingRepository() {
        return _super.call(this, BuildingSchema) || this;
    }
    return BuildingRepository;
}(RepositoryBase));
Object.seal(BuildingRepository);
module.exports = BuildingRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDBEQUE2RDtBQUM3RCxnR0FBbUc7QUFFbkc7SUFBaUMsc0NBQXdCO0lBQ3ZEO2VBQ0Usa0JBQU0sY0FBYyxDQUFDO0lBQ3ZCLENBQUM7SUFFSCx5QkFBQztBQUFELENBTEEsQUFLQyxDQUxnQyxjQUFjLEdBSzlDO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFTLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBCdWlsZGluZ1NjaGVtYSA9IHJlcXVpcmUoJy4uL3NjaGVtYXMvQnVpbGRpbmdTY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2Jhc2UvcmVwb3NpdG9yeS5iYXNlJyk7XHJcblxyXG5jbGFzcyBCdWlsZGluZ1JlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxCdWlsZGluZz4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoQnVpbGRpbmdTY2hlbWEpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEJ1aWxkaW5nUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IEJ1aWxkaW5nUmVwb3NpdG9yeTtcclxuIl19
