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
    UserRepository.prototype.retrieveWithLimit = function (field, projection, limit, callback) {
        UserSchema.find(field, projection).limit(limit).lean().exec(function (err, res) {
            callback(err, res);
        });
    };
    return UserRepository;
}(RepositoryBase));
Object.seal(UserRepository);
module.exports = UserRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCx1REFBMEQ7QUFFMUQ7SUFBNkIsa0NBQW9CO0lBQy9DO2VBQ0Usa0JBQU0sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFFRCwwQ0FBaUIsR0FBakIsVUFBa0IsS0FBVSxFQUFFLFVBQWdCLEVBQUUsS0FBYyxFQUFFLFFBQTJDO1FBQ3pHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUNuRSxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FWQSxBQVVDLENBVjRCLGNBQWMsR0FVMUM7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzVCLGlCQUFTLGNBQWMsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlciA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS91c2VyXCIpO1xuaW1wb3J0IFVzZXJTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy91c2VyLnNjaGVtYVwiKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xuXG5jbGFzcyBVc2VyUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPFVzZXI+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoVXNlclNjaGVtYSk7XG4gIH1cblxuICByZXRyaWV2ZVdpdGhMaW1pdChmaWVsZDogYW55LCBwcm9qZWN0aW9uIDogYW55LCBsaW1pdCA6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIFVzZXJTY2hlbWEuZmluZChmaWVsZCwgcHJvamVjdGlvbikubGltaXQobGltaXQpLmxlYW4oKS5leGVjKChlcnIsIHJlcykgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xuICAgIH0pO1xuICB9XG59XG5PYmplY3Quc2VhbChVc2VyUmVwb3NpdG9yeSk7XG5leHBvcnQgPSBVc2VyUmVwb3NpdG9yeTtcbiJdfQ==
