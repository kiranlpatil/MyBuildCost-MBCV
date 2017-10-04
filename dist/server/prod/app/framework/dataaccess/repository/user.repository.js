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
var UserSchema = require("../schemas/user.schema");
var RepositoryBase = require("./base/repository.base");
var UserRepository = (function (_super) {
    __extends(UserRepository, _super);
    function UserRepository() {
        return _super.call(this, UserSchema) || this;
    }
    return UserRepository;
}(RepositoryBase));
Object.seal(UserRepository);
module.exports = UserRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCx1REFBMEQ7QUFFMUQ7SUFBNkIsa0NBQW9CO0lBQy9DO2VBQ0Usa0JBQU0sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFDSCxxQkFBQztBQUFELENBSkEsQUFJQyxDQUo0QixjQUFjLEdBSTFDO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QixpQkFBUyxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVzZXIgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvdXNlclwiKTtcclxuaW1wb3J0IFVzZXJTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy91c2VyLnNjaGVtYVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XHJcblxyXG5jbGFzcyBVc2VyUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPFVzZXI+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFVzZXJTY2hlbWEpO1xyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChVc2VyUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IFVzZXJSZXBvc2l0b3J5O1xyXG4iXX0=
