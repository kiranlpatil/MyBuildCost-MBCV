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
var ScenarioSchema = require("../schemas/scenario.schema");
var RepositoryBase = require("./base/repository.base");
var ScenarioRepository = (function (_super) {
    __extends(ScenarioRepository, _super);
    function ScenarioRepository() {
        return _super.call(this, ScenarioSchema) || this;
    }
    return ScenarioRepository;
}(RepositoryBase));
Object.seal(ScenarioRepository);
module.exports = ScenarioRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3NjZW5hcmlvLnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBRzFEO0lBQWlDLHNDQUF5QjtJQUN4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUpBLEFBSUMsQ0FKZ0MsY0FBYyxHQUk5QztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9zY2VuYXJpby5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5hcmlvU2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvc2NlbmFyaW8uc2NoZW1hXCIpO1xuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4vYmFzZS9yZXBvc2l0b3J5LmJhc2VcIik7XG5pbXBvcnQgSVNjZW5hcmlvID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL3NjZW5hcmlvXCIpO1xuXG5jbGFzcyBTY2VuYXJpb1JlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJU2NlbmFyaW8+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU2NlbmFyaW9TY2hlbWEpO1xuICB9XG59XG5PYmplY3Quc2VhbChTY2VuYXJpb1JlcG9zaXRvcnkpO1xuZXhwb3J0ID0gU2NlbmFyaW9SZXBvc2l0b3J5O1xuIl19
