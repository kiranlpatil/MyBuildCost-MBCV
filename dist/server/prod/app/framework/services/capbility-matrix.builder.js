"use strict";
var ProjectAsset = require("../shared/projectasset");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var UserRepository = require("../dataaccess/repository/user.repository");
var LocationRepository = require("../dataaccess/repository/location.repository");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var CapabilityMatrixService = (function () {
    function CapabilityMatrixService() {
        this.candidateRepository = new CandidateRepository();
        this.userRepository = new UserRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.locationRepository = new LocationRepository();
        this.industryRepositiry = new IndustryRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    CapabilityMatrixService.prototype.getCapabilityMatrix = function (item, industries, new_capability_matrix) {
        console.log(item);
        console.log(industries);
        if (item.industry.roles && item.industry.roles.length > 0) {
            for (var _i = 0, _a = item.industry.roles; _i < _a.length; _i++) {
                var role = _a[_i];
                if (role.capabilities && role.capabilities.length > 0) {
                    for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                        var capability = _c[_b];
                        if (capability.code) {
                            for (var _d = 0, _e = industries[0].roles; _d < _e.length; _d++) {
                                var mainRole = _e[_d];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _f = 0, _g = mainRole.capabilities; _f < _g.length; _f++) {
                                        var mainCap = _g[_f];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _h = 0, _j = mainCap.complexities; _h < _j.length; _h++) {
                                                var mainComp = _j[_h];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.capability_matrix && item.capability_matrix[itemcode] === undefined) {
                                                    new_capability_matrix[itemcode] = -1;
                                                    item.capability_matrix[itemcode] = -1;
                                                }
                                                else if (item.capability_matrix && item.capability_matrix[itemcode] !== -1) {
                                                    new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                                                }
                                                else {
                                                    new_capability_matrix[itemcode] = -1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (role.default_complexities) {
                    for (var _k = 0, _l = role.default_complexities; _k < _l.length; _k++) {
                        var capability = _l[_k];
                        if (capability.code) {
                            for (var _m = 0, _o = industries[0].roles; _m < _o.length; _m++) {
                                var mainRole = _o[_m];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _p = 0, _q = mainRole.default_complexities; _p < _q.length; _p++) {
                                        var mainCap = _q[_p];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _r = 0, _s = mainCap.complexities; _r < _s.length; _r++) {
                                                var mainComp = _s[_r];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.capability_matrix && item.capability_matrix[itemcode] === undefined) {
                                                    new_capability_matrix[itemcode] = -1;
                                                    item.capability_matrix[itemcode] = -1;
                                                }
                                                else if (item.capability_matrix && item.capability_matrix[itemcode] !== -1) {
                                                    new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                                                }
                                                else {
                                                    new_capability_matrix[itemcode] = -1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return new_capability_matrix;
    };
    CapabilityMatrixService.prototype.getComplexityMustHaveMatrix = function (item, industries, new_complexity_musthave_matrix) {
        console.log(item);
        console.log(industries);
        if (item.industry.roles && item.industry.roles.length > 0) {
            for (var _i = 0, _a = item.industry.roles; _i < _a.length; _i++) {
                var role = _a[_i];
                if (role.capabilities && role.capabilities.length > 0) {
                    for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                        var capability = _c[_b];
                        if (capability.code) {
                            for (var _d = 0, _e = industries[0].roles; _d < _e.length; _d++) {
                                var mainRole = _e[_d];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _f = 0, _g = mainRole.capabilities; _f < _g.length; _f++) {
                                        var mainCap = _g[_f];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _h = 0, _j = mainCap.complexities; _h < _j.length; _h++) {
                                                var mainComp = _j[_h];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] === undefined) {
                                                    new_complexity_musthave_matrix[itemcode] = false;
                                                    item.complexity_musthave_matrix[itemcode] = false;
                                                }
                                                else if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] !== false) {
                                                    new_complexity_musthave_matrix[itemcode] = item.complexity_musthave_matrix[itemcode];
                                                }
                                                else {
                                                    new_complexity_musthave_matrix[itemcode] = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (role.default_complexities) {
                    for (var _k = 0, _l = role.default_complexities; _k < _l.length; _k++) {
                        var capability = _l[_k];
                        if (capability.code) {
                            for (var _m = 0, _o = industries[0].roles; _m < _o.length; _m++) {
                                var mainRole = _o[_m];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _p = 0, _q = mainRole.default_complexities; _p < _q.length; _p++) {
                                        var mainCap = _q[_p];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _r = 0, _s = mainCap.complexities; _r < _s.length; _r++) {
                                                var mainComp = _s[_r];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] === undefined) {
                                                    new_complexity_musthave_matrix[itemcode] = false;
                                                    item.complexity_musthave_matrix[itemcode] = false;
                                                }
                                                else if (item.complexity_musthave_matrix && item.complexity_musthave_matrix[itemcode] !== false) {
                                                    new_complexity_musthave_matrix[itemcode] = item.complexity_musthave_matrix[itemcode];
                                                }
                                                else {
                                                    new_complexity_musthave_matrix[itemcode] = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return new_complexity_musthave_matrix;
    };
    return CapabilityMatrixService;
}());
Object.seal(CapabilityMatrixService);
module.exports = CapabilityMatrixService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FwYmlsaXR5LW1hdHJpeC5idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxxREFBd0Q7QUFDeEQsbUZBQXNGO0FBQ3RGLHlFQUE0RTtBQUM1RSxpRkFBb0Y7QUFDcEYsbUZBQXNGO0FBQ3RGLGlGQUFvRjtBQUVwRjtJQVNFO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxxREFBbUIsR0FBbkIsVUFBb0IsSUFBUyxFQUFFLFVBQTJCLEVBQUUscUJBQTBCO1FBQ3BGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxHQUFHLENBQUMsQ0FBYSxVQUFtQixFQUFuQixLQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFuQixjQUFtQixFQUFuQixJQUFtQjtnQkFBL0IsSUFBSSxJQUFJLFNBQUE7Z0JBQ1gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFB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Q0FBQyxDQUFDO29EQUMvRiw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7b0RBQ2pELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7Z0RBQ3BELENBQUM7Z0RBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsSUFBSSxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvREFDbEcsOEJBQThCLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dEQUN2RixDQUFDO2dEQUFDLElBQUksQ0FBQyxDQUFDO29EQUNOLDhCQUE4QixDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztnREFDbkQsQ0FBQzs2Q0FDRjt3Q0FDSCxDQUFDO3FDQUNGO2dDQUNILENBQUM7NkJBQ0Y7d0JBQ0gsQ0FBQztxQkFDRjtnQkFDSCxDQUFDO2FBQ0Y7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLDhCQUE4QixDQUFDO0lBQ3hDLENBQUM7SUFDSCw4QkFBQztBQUFELENBMUlBLEFBMElDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDckMsaUJBQVMsdUJBQXVCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9jYXBiaWxpdHktbWF0cml4LmJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgTG9jYXRpb25SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2xvY2F0aW9uLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWxcIik7XHJcbmNsYXNzIENhcGFiaWxpdHlNYXRyaXhTZXJ2aWNlIHtcclxuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBsb2NhdGlvblJlcG9zaXRvcnk6IExvY2F0aW9uUmVwb3NpdG9yeTtcclxuXHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkgPSBuZXcgQ2FuZGlkYXRlUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMubG9jYXRpb25SZXBvc2l0b3J5ID0gbmV3IExvY2F0aW9uUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FwYWJpbGl0eU1hdHJpeChpdGVtOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSwgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkpOiBhbnkge1xyXG4gICAgY29uc29sZS5sb2coaXRlbSk7XHJcbiAgICBjb25zb2xlLmxvZyhpbmR1c3RyaWVzKTtcclxuICAgIGlmIChpdGVtLmluZHVzdHJ5LnJvbGVzICYmIGl0ZW0uaW5kdXN0cnkucm9sZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCByb2xlIG9mIGl0ZW0uaW5kdXN0cnkucm9sZXMpIHtcclxuICAgICAgICBpZiAocm9sZS5jYXBhYmlsaXRpZXMgJiYgcm9sZS5jYXBhYmlsaXRpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICBpZiAoY2FwYWJpbGl0eS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgbWFpblJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvbGUuY29kZS50b1N0cmluZygpID09PSBtYWluUm9sZS5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbWFpbkNhcCBvZiBtYWluUm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FwYWJpbGl0eS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5DYXAuY29kZS50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ29tcCBvZiBtYWluQ2FwLmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbWNvZGUgPSBtYWluQ2FwLmNvZGUgKyAnXycgKyBtYWluQ29tcC5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeCAmJiBpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeCAmJiBpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mICByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHkuY29kZS50b1N0cmluZygpID09PSBtYWluQ2FwLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbWFpbkNvbXAgb2YgbWFpbkNhcC5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1jb2RlID0gbWFpbkNhcC5jb2RlICsgJ18nICsgbWFpbkNvbXAuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXggJiYgaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXggJiYgaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld19jYXBhYmlsaXR5X21hdHJpeDtcclxuICB9XHJcblxyXG4gIC8vZ2V0Q29tcGxleGl0eU11c3RIYXZlTWF0cml4XHJcbiAgZ2V0Q29tcGxleGl0eU11c3RIYXZlTWF0cml4KGl0ZW06IGFueSwgaW5kdXN0cmllczogSW5kdXN0cnlNb2RlbFtdLCBuZXdfY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXg6IGFueSk6IGFueSB7XHJcbiAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgIGNvbnNvbGUubG9nKGluZHVzdHJpZXMpO1xyXG4gICAgaWYgKGl0ZW0uaW5kdXN0cnkucm9sZXMgJiYgaXRlbS5pbmR1c3RyeS5yb2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaXRlbS5pbmR1c3RyeS5yb2xlcykge1xyXG4gICAgICAgIGlmIChyb2xlLmNhcGFiaWxpdGllcyAmJiByb2xlLmNhcGFiaWxpdGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUudG9TdHJpbmcoKSA9PT0gbWFpbkNhcC5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG1haW5Db21wIG9mIG1haW5DYXAuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtY29kZSA9IG1haW5DYXAuY29kZSArICdfJyArIG1haW5Db21wLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGl0ZW0uY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtpdGVtY29kZV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGl0ZW0uY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtpdGVtY29kZV0gPSBpdGVtLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2l0ZW1jb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2YgIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IG1haW5Sb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyb2xlLmNvZGUudG9TdHJpbmcoKSA9PT0gbWFpblJvbGUuY29kZS50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IG1haW5DYXAgb2YgbWFpblJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FwYWJpbGl0eS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5DYXAuY29kZS50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ29tcCBvZiBtYWluQ2FwLmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbWNvZGUgPSBtYWluQ2FwLmNvZGUgKyAnXycgKyBtYWluQ29tcC5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCAmJiBpdGVtLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2l0ZW1jb2RlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2l0ZW1jb2RlXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCAmJiBpdGVtLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2l0ZW1jb2RlXSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbaXRlbWNvZGVdID0gaXRlbS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtpdGVtY29kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2l0ZW1jb2RlXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3X2NvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4O1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoQ2FwYWJpbGl0eU1hdHJpeFNlcnZpY2UpO1xyXG5leHBvcnQgPSBDYXBhYmlsaXR5TWF0cml4U2VydmljZTtcclxuIl19
