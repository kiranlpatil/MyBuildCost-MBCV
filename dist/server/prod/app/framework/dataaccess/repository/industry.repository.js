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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBTTFEO0lBQWlDLHNDQUF5QjtJQUd4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQsc0NBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxRQUEyQztRQUFuRSxpQkF5Q0M7UUF4Q0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQyxpQ0FBaUMsRUFBQyxDQUFDLEVBQUMsNEJBQTRCLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFRLEVBQUUsUUFBYTtZQUMzSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFjLEVBQUUsRUFBYzt3QkFDcEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENB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QUFVLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSCx5QkFBQztBQUFELENBdFFBLEFBc1FDLENBdFFnQyxjQUFjLEdBc1E5QztBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEluZHVzdHJ5U2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hcy9pbmR1c3RyeS5zY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi9iYXNlL3JlcG9zaXRvcnkuYmFzZScpO1xyXG5pbXBvcnQgSUluZHVzdHJ5ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvaW5kdXN0cnknKTtcclxuaW1wb3J0IFJvbGVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL3JvbGUubW9kZWwnKTtcclxuaW1wb3J0IENhcGFiaWxpdHlNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYXBhYmlsaXR5Lm1vZGVsXCIpO1xyXG5pbXBvcnQgQ29tcGxleGl0eU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2NvbXBsZXhpdHkubW9kZWxcIik7XHJcblxyXG5jbGFzcyBJbmR1c3RyeVJlcG9zaXRvcnkgZXh0ZW5kcyBSZXBvc2l0b3J5QmFzZTxJSW5kdXN0cnk+IHtcclxuICBwcml2YXRlIGl0ZW1zOiBSb2xlTW9kZWxbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihJbmR1c3RyeVNjaGVtYSk7XHJcbiAgfVxyXG5cclxuICBmaW5kUm9sZXMoY29kZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gbmV3IEFycmF5KDApO1xyXG4gICAgY29uc29sZS50aW1lKCdmaW5kUm9sZScpO1xyXG4gICAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHsnY29kZSc6IGNvZGV9LHsncm9sZXMuY2FwYWJpbGl0aWVzLmNvbXBsZXhpdGllcyc6MCwncm9sZXMuZGVmYXVsdF9jb21wbGV4aXRpZXMnOjB9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1JlY29yZHMgYXJlIG5vdCBmb3VuZCcpLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgJ2luZHVzdHJ5TmFtZSc6IGluZHVzdHJ5WzBdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAnX2lkJzogcm9sZS5faWQsXHJcbiAgICAgICAgICAgICAgICAnc29ydF9vcmRlcic6IHJvbGUuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICduYW1lJzogcm9sZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgJ2NvZGUnOiByb2xlLmNvZGUsXHJcbiAgICAgICAgICAgICAgICAnYWxsY2FwYWJpbGl0aWVzJzogcm9sZS5jYXBhYmlsaXRpZXMubWFwKChjYXBhYmlsaXR5OmFueSk9PiBjYXBhYmlsaXR5Lm5hbWUpXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRSb2xlJyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kQ2FwYWJpbGl0aWVzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcclxuICAgIGNvbnNvbGUudGltZSgnZmluZENhcGFiaWxpdHknKTtcclxuXHJcbiAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHsnY29kZSc6IGl0ZW0uY29kZX0seydyb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzLnNjZW5hcmlvcyc6MH0pLmxlYW4oKS5leGVjKChlcnI6IGFueSwgaW5kdXN0cnk6IGFueSk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdSZWNvcmRzIGFyZSBub3QgZm91bmQnKSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICByMi5zb3J0X29yZGVyID0gOTk5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvZGUgb2YgaXRlbS5yb2xlcykge1xyXG4gICAgICAgICAgICAgIGlmIChjb2RlID09IHJvbGUuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvbGVfb2JqZWN0OiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHJvbGUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgY29kZTogcm9sZS5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiByb2xlLnNvcnRfb3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRfY29tcGxleGl0aWVzOiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcm9sZV9vYmplY3QuY2FwYWJpbGl0aWVzID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgICAgcm9sZS5jYXBhYmlsaXRpZXMuc29ydCgocjEgOiBDYXBhYmlsaXR5TW9kZWwsIHIyIDogQ2FwYWJpbGl0eU1vZGVsKSA6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgcjIuc29ydF9vcmRlcj05OTk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYoY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMgJiYgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICdpbmR1c3RyeU5hbWUnOiBpbmR1c3RyeVswXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ3JvbGVOYW1lJzogcm9sZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ19pZCc6IGNhcGFiaWxpdHkuX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBjYXBhYmlsaXR5Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAnY29kZSc6IGNhcGFiaWxpdHkuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNhcGFiaWxpdHkuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICdhbGxjb21wbGV4aXRpZXMnOiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5tYXAoKGNvbXBsZXhpdHk6YW55KT0+IGNvbXBsZXhpdHkubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5yZW1vdmVEdXBsaWNhdGVDYXBiaWxpdHkodGhpcy5pdGVtcyxvYmopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcy5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcm9sZV9vYmplY3QuY2FwYWJpbGl0aWVzLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRDYXBhYmlsaXR5Jyk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzLml0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICByZW1vdmVEdXBsaWNhdGVDYXBiaWxpdHkocm9sZXM6YW55LG9iajphbnkpOmJvb2xlYW4ge1xyXG4gICAgICAgIGZvcihsZXQgayBvZiByb2xlcykge1xyXG4gICAgICAgICAgaWYoay5jYXBhYmlsaXRpZXMuZmluZEluZGV4KCh4OmFueSkgPT4geC5jb2RlID09PSBvYmouY29kZSkgPj0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGZpbmRDb21wbGV4aXRpZXMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gbmV3IEFycmF5KDApO1xyXG4gICAgY29uc29sZS50aW1lKCdmaW5kQ29tcGxleGl0eScpO1xyXG4gICAgSW5kdXN0cnlTY2hlbWEuZmluZCh7J2NvZGUnOiBpdGVtLmNvZGV9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaW5kdXN0cnkubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUmVjb3JkcyBhcmUgbm90IGZvdW5kJyksIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbmR1c3RyeVswXS5yb2xlcy5zb3J0KChyMSA6IFJvbGVNb2RlbCwgcjIgOiBSb2xlTW9kZWwpIDogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyeVswXS5yb2xlcykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2RlIG9mIGl0ZW0ucm9sZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY29kZSA9PSByb2xlLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlX29iamVjdDogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiByb2xlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IHJvbGUuY29kZSxcclxuICAgICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgc29ydF9vcmRlcjogcm9sZS5zb3J0X29yZGVyLFxyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvbGUuY2FwYWJpbGl0aWVzLnNvcnQoKHIxIDogQ2FwYWJpbGl0eU1vZGVsLCByMiA6IENhcGFiaWxpdHlNb2RlbCkgOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9iIG9mIGl0ZW0uY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iID09IGNhcGFiaWxpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGNhcGFiaWxpdHlfb2JqZWN0OiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNhcGFiaWxpdHkubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY2FwYWJpbGl0eS5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiBjYXBhYmlsaXR5LnNvcnRfb3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW11cclxuICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5zb3J0KChyMSA6IENvbXBsZXhpdHlNb2RlbCwgcjIgOiBDb21wbGV4aXR5TW9kZWwpIDogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eV9vYmplY3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wbGV4aXR5Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29tcGxleGl0eS5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNvbXBsZXhpdHkuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkZvckNhbmRpZGF0ZTogY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuYXJpb3M6IGNvbXBsZXhpdHkuc2NlbmFyaW9zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdHlfb2JqZWN0LmNvbXBsZXhpdGllcy5wdXNoKGNvbXBsZXhpdHlfb2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcy5wdXNoKGNhcGFiaWxpdHlfb2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRDb21wbGV4aXR5Jyk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzLml0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHJpdmVJbmR1c3RyaWVzV2l0aFNvcnRlZE9yZGVyKGV4Y2x1ZGVkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIEluZHVzdHJ5U2NoZW1hLmZpbmQoe30sIGV4Y2x1ZGVkKS5sZWFuKCkuZXhlYyhmdW5jdGlvbiAoZXJyOiBhbnksIGl0ZW1zOiBhbnkpIHtcclxuICAgICAgaXRlbXMuc29ydCgocjE6IGFueSwgcjI6IGFueSk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgaWYgKCFyMS5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICByMS5zb3J0X29yZGVyID0gOTk5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgIHIyLnNvcnRfb3JkZXIgPSA5OTk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChOdW1iZXIocjEuc29ydF9vcmRlcikgPCBOdW1iZXIocjIuc29ydF9vcmRlcikpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE51bWJlcihyMS5zb3J0X29yZGVyKSA+IE51bWJlcihyMi5zb3J0X29yZGVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNhbGxiYWNrKGVyciwgaXRlbXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5PYmplY3Quc2VhbChJbmR1c3RyeVJlcG9zaXRvcnkpO1xyXG5leHBvcnQgPSBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiJdfQ==
