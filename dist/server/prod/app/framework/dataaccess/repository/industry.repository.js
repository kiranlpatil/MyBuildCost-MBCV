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
var IndustrySchema = require("../schemas/industry.schema");
var RepositoryBase = require("./base/repository.base");
var IndustryRepository = (function (_super) {
    __extends(IndustryRepository, _super);
    function IndustryRepository() {
        return _super.call(this, IndustrySchema) || this;
    }
    IndustryRepository.prototype.findRoles = function (code, callback) {
        var _this = this;
        this.items = new Array(0);
        console.time('findRole');
        IndustrySchema.find({ 'code': code }, { 'roles.capabilities.complexities': 0, 'roles.default_complexities': 0 }).lean().exec(function (err, industry) {
            if (err) {
                callback(err, null);
            }
            else {
                if (industry.length <= 0) {
                    callback(new Error('Records are not found'), null);
                }
                else {
                    industry[0].roles.sort(function (r1, r2) {
                        if (!r1.sort_order) {
                            r1.sort_order = 999;
                        }
                        if (!r2.sort_order) {
                            r2.sort_order = 999;
                        }
                        if (r1.sort_order < r2.sort_order) {
                            return -1;
                        }
                        if (r1.sort_order > r2.sort_order) {
                            return 1;
                        }
                        return -1;
                    });
                    for (var _i = 0, _a = industry[0].roles; _i < _a.length; _i++) {
                        var role = _a[_i];
                        var obj = {
                            'industryName': industry[0].name,
                            '_id': role._id,
                            'sort_order': role.sort_order,
                            'name': role.name,
                            'code': role.code,
                            'allcapabilities': role.capabilities.map(function (capability) { return capability.name; })
                        };
                        _this.items.push(obj);
                    }
                    console.timeEnd('findRole');
                    callback(null, _this.items);
                }
            }
        });
    };
    IndustryRepository.prototype.findCapabilities = function (item, callback) {
        var _this = this;
        this.items = new Array(0);
        console.time('findCapability');
        IndustrySchema.find({ 'code': item.code }, { 'roles.capabilities.complexities.scenarios': 0 }).lean().exec(function (err, industry) {
            if (err) {
                callback(err, null);
            }
            else {
                if (industry.length <= 0) {
                    callback(new Error('Records are not found'), null);
                }
                else {
                    industry[0].roles.sort(function (r1, r2) {
                        if (!r1.sort_order) {
                            r1.sort_order = 999;
                        }
                        if (!r2.sort_order) {
                            r2.sort_order = 999;
                        }
                        if (r1.sort_order < r2.sort_order) {
                            return -1;
                        }
                        if (r1.sort_order > r2.sort_order) {
                            return 1;
                        }
                        return -1;
                    });
                    for (var _i = 0, _a = industry[0].roles; _i < _a.length; _i++) {
                        var role = _a[_i];
                        for (var _b = 0, _c = item.roles; _b < _c.length; _b++) {
                            var code = _c[_b];
                            if (code == role.code) {
                                var role_object = {
                                    name: role.name,
                                    code: role.code,
                                    capabilities: [],
                                    sort_order: role.sort_order,
                                    default_complexities: role.default_complexities
                                };
                                role_object.capabilities = new Array(0);
                                role.capabilities.sort(function (r1, r2) {
                                    if (!r1.sort_order) {
                                        r1.sort_order = 999;
                                    }
                                    if (!r2.sort_order) {
                                        r2.sort_order = 999;
                                    }
                                    if (r1.sort_order < r2.sort_order) {
                                        return -1;
                                    }
                                    if (r1.sort_order > r2.sort_order) {
                                        return 1;
                                    }
                                    return -1;
                                });
                                for (var _d = 0, _e = role.capabilities; _d < _e.length; _d++) {
                                    var capability = _e[_d];
                                    if (capability.complexities && capability.complexities.length > 0) {
                                        var obj = {
                                            'industryName': industry[0].name,
                                            'roleName': role.name,
                                            '_id': capability._id,
                                            'name': capability.name,
                                            'code': capability.code,
                                            sort_order: capability.sort_order,
                                            'allcomplexities': capability.complexities.map(function (complexity) { return complexity.name; })
                                        };
                                        if (_this.items.length > 0) {
                                            if (_this.removeDuplicateCapbility(_this.items, obj)) {
                                                role_object.capabilities.push(obj);
                                            }
                                        }
                                        else {
                                            role_object.capabilities.push(obj);
                                        }
                                    }
                                }
                                _this.items.push(role_object);
                            }
                        }
                    }
                    console.timeEnd('findCapability');
                    callback(null, _this.items);
                }
            }
        });
    };
    IndustryRepository.prototype.removeDuplicateCapbility = function (roles, obj) {
        for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
            var k = roles_1[_i];
            if (k.capabilities.findIndex(function (x) { return x.code === obj.code; }) >= 0) {
                return false;
            }
        }
        return true;
    };
    IndustryRepository.prototype.findComplexities = function (item, callback) {
        var _this = this;
        this.items = new Array(0);
        console.time('findComplexity');
        IndustrySchema.find({ 'code': item.code }).lean().exec(function (err, industry) {
            if (err) {
                callback(err, null);
            }
            else {
                if (industry.length <= 0) {
                    callback(new Error('Records are not found'), null);
                }
                else {
                    industry[0].roles.sort(function (r1, r2) {
                        if (!r1.sort_order) {
                            r1.sort_order = 999;
                        }
                        if (!r2.sort_order) {
                            r2.sort_order = 999;
                        }
                        if (r1.sort_order < r2.sort_order) {
                            return -1;
                        }
                        if (r1.sort_order > r2.sort_order) {
                            return 1;
                        }
                        return -1;
                    });
                    for (var _i = 0, _a = industry[0].roles; _i < _a.length; _i++) {
                        var role = _a[_i];
                        for (var _b = 0, _c = item.roles; _b < _c.length; _b++) {
                            var code = _c[_b];
                            if (code == role.code) {
                                var role_object = {
                                    name: role.name,
                                    code: role.code,
                                    capabilities: [],
                                    sort_order: role.sort_order,
                                    default_complexities: role.default_complexities
                                };
                                role.capabilities.sort(function (r1, r2) {
                                    if (!r1.sort_order) {
                                        r1.sort_order = 999;
                                    }
                                    if (!r2.sort_order) {
                                        r2.sort_order = 999;
                                    }
                                    if (r1.sort_order < r2.sort_order) {
                                        return -1;
                                    }
                                    if (r1.sort_order > r2.sort_order) {
                                        return 1;
                                    }
                                    return -1;
                                });
                                for (var _d = 0, _e = role.capabilities; _d < _e.length; _d++) {
                                    var capability = _e[_d];
                                    for (var _f = 0, _g = item.capabilities; _f < _g.length; _f++) {
                                        var ob = _g[_f];
                                        if (ob == capability.code) {
                                            var capability_object = {
                                                name: capability.name,
                                                code: capability.code,
                                                sort_order: capability.sort_order,
                                                complexities: []
                                            };
                                            capability.complexities.sort(function (r1, r2) {
                                                if (!r1.sort_order) {
                                                    r1.sort_order = 999;
                                                }
                                                if (!r2.sort_order) {
                                                    r2.sort_order = 999;
                                                }
                                                if (r1.sort_order < r2.sort_order) {
                                                    return -1;
                                                }
                                                if (r1.sort_order > r2.sort_order) {
                                                    return 1;
                                                }
                                                return -1;
                                            });
                                            for (var _h = 0, _j = capability.complexities; _h < _j.length; _h++) {
                                                var complexity = _j[_h];
                                                var complexity_object = {
                                                    name: complexity.name,
                                                    code: complexity.code,
                                                    sort_order: complexity.sort_order,
                                                    questionForCandidate: complexity.questionForCandidate,
                                                    questionForRecruiter: complexity.questionForRecruiter,
                                                    scenarios: complexity.scenarios
                                                };
                                                capability_object.complexities.push(complexity_object);
                                            }
                                            role_object.capabilities.push(capability_object);
                                        }
                                    }
                                }
                                _this.items.push(role_object);
                            }
                        }
                    }
                    console.timeEnd('findComplexity');
                    callback(null, _this.items);
                }
            }
        });
    };
    IndustryRepository.prototype.retriveIndustriesWithSortedOrder = function (excluded, callback) {
        IndustrySchema.find({}, excluded).lean().exec(function (err, items) {
            items.sort(function (r1, r2) {
                if (!r1.sort_order) {
                    r1.sort_order = 999;
                }
                if (!r2.sort_order) {
                    r2.sort_order = 999;
                }
                if (Number(r1.sort_order) < Number(r2.sort_order)) {
                    return -1;
                }
                if (Number(r1.sort_order) > Number(r2.sort_order)) {
                    return 1;
                }
                return -1;
            });
            callback(err, items);
        });
    };
    return IndustryRepository;
}(RepositoryBase));
Object.seal(IndustryRepository);
module.exports = IndustryRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBTTFEO0lBQWlDLHNDQUF5QjtJQUd4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQsc0NBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxRQUEyQztRQUFuRSxpQkF5Q0M7UUF4Q0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQyxpQ0FBaUMsRUFBQyxDQUFDLEVBQUMsNEJBQTRCLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFRLEVBQUUsUUFBYTtZQUMzSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFjLEVBQUUsRUFBYzt3QkFDcEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENB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QUFVLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSCx5QkFBQztBQUFELENBdFFBLEFBc1FDLENBdFFnQyxjQUFjLEdBc1E5QztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEluZHVzdHJ5U2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hcy9pbmR1c3RyeS5zY2hlbWEnKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoJy4vYmFzZS9yZXBvc2l0b3J5LmJhc2UnKTtcbmltcG9ydCBJSW5kdXN0cnkgPSByZXF1aXJlKCcuLi9tb25nb29zZS9pbmR1c3RyeScpO1xuaW1wb3J0IFJvbGVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL3JvbGUubW9kZWwnKTtcbmltcG9ydCBDYXBhYmlsaXR5TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY2FwYWJpbGl0eS5tb2RlbFwiKTtcbmltcG9ydCBDb21wbGV4aXR5TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY29tcGxleGl0eS5tb2RlbFwiKTtcblxuY2xhc3MgSW5kdXN0cnlSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUluZHVzdHJ5PiB7XG4gIHByaXZhdGUgaXRlbXM6IFJvbGVNb2RlbFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEluZHVzdHJ5U2NoZW1hKTtcbiAgfVxuXG4gIGZpbmRSb2xlcyhjb2RlOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLml0ZW1zID0gbmV3IEFycmF5KDApO1xuICAgIGNvbnNvbGUudGltZSgnZmluZFJvbGUnKTtcbiAgICAgIEluZHVzdHJ5U2NoZW1hLmZpbmQoeydjb2RlJzogY29kZX0seydyb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzJzowLCdyb2xlcy5kZWZhdWx0X2NvbXBsZXhpdGllcyc6MH0pLmxlYW4oKS5leGVjKChlcnI6IGFueSwgaW5kdXN0cnk6IGFueSk9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdSZWNvcmRzIGFyZSBub3QgZm91bmQnKSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XG4gICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAnaW5kdXN0cnlOYW1lJzogaW5kdXN0cnlbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICAnX2lkJzogcm9sZS5faWQsXG4gICAgICAgICAgICAgICAgJ3NvcnRfb3JkZXInOiByb2xlLnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgJ25hbWUnOiByb2xlLm5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvZGUnOiByb2xlLmNvZGUsXG4gICAgICAgICAgICAgICAgJ2FsbGNhcGFiaWxpdGllcyc6IHJvbGUuY2FwYWJpbGl0aWVzLm1hcCgoY2FwYWJpbGl0eTphbnkpPT4gY2FwYWJpbGl0eS5uYW1lKVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZmluZFJvbGUnKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBmaW5kQ2FwYWJpbGl0aWVzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgQXJyYXkoMCk7XG4gICAgY29uc29sZS50aW1lKCdmaW5kQ2FwYWJpbGl0eScpO1xuXG4gICAgSW5kdXN0cnlTY2hlbWEuZmluZCh7J2NvZGUnOiBpdGVtLmNvZGV9LHsncm9sZXMuY2FwYWJpbGl0aWVzLmNvbXBsZXhpdGllcy5zY2VuYXJpb3MnOjB9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGluZHVzdHJ5Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdSZWNvcmRzIGFyZSBub3QgZm91bmQnKSwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kdXN0cnlbMF0ucm9sZXMuc29ydCgocjEgOiBSb2xlTW9kZWwsIHIyIDogUm9sZU1vZGVsKSA6IG51bWJlciA9PiB7XG4gICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgcjIuc29ydF9vcmRlciA9IDk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnlbMF0ucm9sZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvZGUgb2YgaXRlbS5yb2xlcykge1xuICAgICAgICAgICAgICBpZiAoY29kZSA9PSByb2xlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcm9sZV9vYmplY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHJvbGUubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNvZGU6IHJvbGUuY29kZSxcbiAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdGllczogW10sXG4gICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiByb2xlLnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcm9sZV9vYmplY3QuY2FwYWJpbGl0aWVzID0gbmV3IEFycmF5KDApO1xuICAgICAgICAgICAgICAgIHJvbGUuY2FwYWJpbGl0aWVzLnNvcnQoKHIxIDogQ2FwYWJpbGl0eU1vZGVsLCByMiA6IENhcGFiaWxpdHlNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgcjIuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgICBpZihjYXBhYmlsaXR5LmNvbXBsZXhpdGllcyAmJiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAnaW5kdXN0cnlOYW1lJzogaW5kdXN0cnlbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAncm9sZU5hbWUnOiByb2xlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgJ19pZCc6IGNhcGFiaWxpdHkuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogY2FwYWJpbGl0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICdjb2RlJzogY2FwYWJpbGl0eS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNhcGFiaWxpdHkuc29ydF9vcmRlcixcbiAgICAgICAgICAgICAgICAgICAgICAnYWxsY29tcGxleGl0aWVzJzogY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMubWFwKChjb21wbGV4aXR5OmFueSk9PiBjb21wbGV4aXR5Lm5hbWUpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucmVtb3ZlRHVwbGljYXRlQ2FwYmlsaXR5KHRoaXMuaXRlbXMsb2JqKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZV9vYmplY3QuY2FwYWJpbGl0aWVzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByb2xlX29iamVjdC5jYXBhYmlsaXRpZXMucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaW5kQ2FwYWJpbGl0eScpO1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmVtb3ZlRHVwbGljYXRlQ2FwYmlsaXR5KHJvbGVzOmFueSxvYmo6YW55KTpib29sZWFuIHtcbiAgICAgICAgZm9yKGxldCBrIG9mIHJvbGVzKSB7XG4gICAgICAgICAgaWYoay5jYXBhYmlsaXRpZXMuZmluZEluZGV4KCh4OmFueSkgPT4geC5jb2RlID09PSBvYmouY29kZSkgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZpbmRDb21wbGV4aXRpZXMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcbiAgICBjb25zb2xlLnRpbWUoJ2ZpbmRDb21wbGV4aXR5Jyk7XG4gICAgSW5kdXN0cnlTY2hlbWEuZmluZCh7J2NvZGUnOiBpdGVtLmNvZGV9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGluZHVzdHJ5Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdSZWNvcmRzIGFyZSBub3QgZm91bmQnKSwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kdXN0cnlbMF0ucm9sZXMuc29ydCgocjEgOiBSb2xlTW9kZWwsIHIyIDogUm9sZU1vZGVsKSA6IG51bWJlciA9PiB7XG4gICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnlbMF0ucm9sZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvZGUgb2YgaXRlbS5yb2xlcykge1xuICAgICAgICAgICAgICBpZiAoY29kZSA9PSByb2xlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcm9sZV9vYmplY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHJvbGUubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNvZGU6IHJvbGUuY29kZSxcbiAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdGllczogW10sXG4gICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiByb2xlLnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcm9sZS5jYXBhYmlsaXRpZXMuc29ydCgocjEgOiBDYXBhYmlsaXR5TW9kZWwsIHIyIDogQ2FwYWJpbGl0eU1vZGVsKSA6IG51bWJlciA9PiB7XG4gICAgICAgICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9iIG9mIGl0ZW0uY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYiA9PSBjYXBhYmlsaXR5LmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FwYWJpbGl0eV9vYmplY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNhcGFiaWxpdHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IGNhcGFiaWxpdHkuY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNhcGFiaWxpdHkuc29ydF9vcmRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW11cbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzLnNvcnQoKHIxIDogQ29tcGxleGl0eU1vZGVsLCByMiA6IENvbXBsZXhpdHlNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcjIuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eV9vYmplY3Q6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY29tcGxleGl0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjb21wbGV4aXR5LmNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNvbXBsZXhpdHkuc29ydF9vcmRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25Gb3JDYW5kaWRhdGU6IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uRm9yUmVjcnVpdGVyOiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuYXJpb3M6IGNvbXBsZXhpdHkuc2NlbmFyaW9zXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FwYWJpbGl0eV9vYmplY3QuY29tcGxleGl0aWVzLnB1c2goY29tcGxleGl0eV9vYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByb2xlX29iamVjdC5jYXBhYmlsaXRpZXMucHVzaChjYXBhYmlsaXR5X29iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHJvbGVfb2JqZWN0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRDb21wbGV4aXR5Jyk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5pdGVtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgcmV0cml2ZUluZHVzdHJpZXNXaXRoU29ydGVkT3JkZXIoZXhjbHVkZWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIEluZHVzdHJ5U2NoZW1hLmZpbmQoe30sIGV4Y2x1ZGVkKS5sZWFuKCkuZXhlYyhmdW5jdGlvbiAoZXJyOiBhbnksIGl0ZW1zOiBhbnkpIHtcbiAgICAgIGl0ZW1zLnNvcnQoKHIxOiBhbnksIHIyOiBhbnkpOiBudW1iZXIgPT4ge1xuICAgICAgICBpZiAoIXIxLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICByMS5zb3J0X29yZGVyID0gOTk5O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgIHIyLnNvcnRfb3JkZXIgPSA5OTk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE51bWJlcihyMS5zb3J0X29yZGVyKSA8IE51bWJlcihyMi5zb3J0X29yZGVyKSkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTnVtYmVyKHIxLnNvcnRfb3JkZXIpID4gTnVtYmVyKHIyLnNvcnRfb3JkZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfSk7XG4gICAgICBjYWxsYmFjayhlcnIsIGl0ZW1zKTtcbiAgICB9KTtcbiAgfVxuXG59XG5PYmplY3Quc2VhbChJbmR1c3RyeVJlcG9zaXRvcnkpO1xuZXhwb3J0ID0gSW5kdXN0cnlSZXBvc2l0b3J5O1xuIl19
