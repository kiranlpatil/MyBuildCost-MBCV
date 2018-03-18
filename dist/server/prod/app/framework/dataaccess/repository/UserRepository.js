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
var UserSchema = require("../schemas/UserSchema");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1VzZXJSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQXFEO0FBQ3JELHVEQUEwRDtBQUUxRDtJQUE2QixrQ0FBb0I7SUFDL0M7ZUFDRSxrQkFBTSxVQUFVLENBQUM7SUFDbkIsQ0FBQztJQUVELDBDQUFpQixHQUFqQixVQUFrQixLQUFVLEVBQUUsVUFBZ0IsRUFBRSxLQUFjLEVBQzVDLFFBQTJDO1FBQzNELFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUNuRSxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVVILHFCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsQ0FwQjRCLGNBQWMsR0FvQjFDO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QixpQkFBUyxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvVXNlclJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFVzZXJTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL1VzZXJTY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi9iYXNlL3JlcG9zaXRvcnkuYmFzZScpO1xyXG5cclxuY2xhc3MgVXNlclJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxVc2VyPiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihVc2VyU2NoZW1hKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlV2l0aExpbWl0KGZpZWxkOiBhbnksIHByb2plY3Rpb24gOiBhbnksIGxpbWl0IDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIFVzZXJTY2hlbWEuZmluZChmaWVsZCwgcHJvamVjdGlvbikubGltaXQobGltaXQpLmxlYW4oKS5leGVjKChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qZ2V0TGF0ZXN0Q2FuZGlkYXRlc0luZm9Gb3JJbmNvbXBsZXRlUHJvZmlsZShDYW5kaWRhdGVVc2VySWRzOm51bWJlcltdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhJbmNsdWRlZCh7J19pZCc6IHskaW46IENhbmRpZGF0ZVVzZXJJZHN9fSxcclxuICAgICAgeydlbWFpbCc6IDEsICdmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9LCAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gIH0qL1xyXG59XHJcblxyXG5PYmplY3Quc2VhbChVc2VyUmVwb3NpdG9yeSk7XHJcbmV4cG9ydCA9IFVzZXJSZXBvc2l0b3J5O1xyXG4iXX0=
