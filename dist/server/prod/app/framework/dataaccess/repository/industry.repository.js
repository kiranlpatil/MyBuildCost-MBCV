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
        IndustrySchema.find({ 'code': code }, { 'roles.capabilities': 0, 'roles.default_complexities': 0 }).lean().exec(function (err, industry) {
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
        IndustrySchema.find({ 'code': item.code }, { 'roles.capabilities.complexities': 0 }).lean().exec(function (err, industry) {
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
                                    var obj = {
                                        'industryName': industry[0].name,
                                        'roleName': role.name,
                                        '_id': capability._id,
                                        'name': capability.name,
                                        'code': capability.code,
                                        sort_order: capability.sort_order,
                                    };
                                    role_object.capabilities.push(obj);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBTTFEO0lBQWlDLHNDQUF5QjtJQUd4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQsc0NBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxRQUEyQztRQUFuRSxpQkF3Q0M7UUF2Q0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQyxvQkFBb0IsRUFBQyxDQUFDLEVBQUMsNEJBQTRCLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFRLEVBQUUsUUFBYTtZQUM5SCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFjLEVBQUUsRUFBYzt3QkFDcEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENB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LEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgseUJBQUM7QUFBRCxDQXJQQSxBQXFQQyxDQXJQZ0MsY0FBYyxHQXFQOUM7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsaUJBQVMsa0JBQWtCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbmR1c3RyeVNjaGVtYSA9IHJlcXVpcmUoJy4uL3NjaGVtYXMvaW5kdXN0cnkuc2NoZW1hJyk7XHJcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoJy4vYmFzZS9yZXBvc2l0b3J5LmJhc2UnKTtcclxuaW1wb3J0IElJbmR1c3RyeSA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL2luZHVzdHJ5Jyk7XHJcbmltcG9ydCBSb2xlTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yb2xlLm1vZGVsJyk7XHJcbmltcG9ydCBDYXBhYmlsaXR5TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY2FwYWJpbGl0eS5tb2RlbFwiKTtcclxuaW1wb3J0IENvbXBsZXhpdHlNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jb21wbGV4aXR5Lm1vZGVsXCIpO1xyXG5cclxuY2xhc3MgSW5kdXN0cnlSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUluZHVzdHJ5PiB7XHJcbiAgcHJpdmF0ZSBpdGVtczogUm9sZU1vZGVsW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoSW5kdXN0cnlTY2hlbWEpO1xyXG4gIH1cclxuXHJcbiAgZmluZFJvbGVzKGNvZGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcclxuICAgIGNvbnNvbGUudGltZSgnZmluZFJvbGUnKTtcclxuICAgICAgSW5kdXN0cnlTY2hlbWEuZmluZCh7J2NvZGUnOiBjb2RlfSx7J3JvbGVzLmNhcGFiaWxpdGllcyc6MCwncm9sZXMuZGVmYXVsdF9jb21wbGV4aXRpZXMnOjB9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1JlY29yZHMgYXJlIG5vdCBmb3VuZCcpLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgJ2luZHVzdHJ5TmFtZSc6IGluZHVzdHJ5WzBdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAnX2lkJzogcm9sZS5faWQsXHJcbiAgICAgICAgICAgICAgICAnc29ydF9vcmRlcic6IHJvbGUuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICduYW1lJzogcm9sZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgJ2NvZGUnOiByb2xlLmNvZGUsXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRSb2xlJyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kQ2FwYWJpbGl0aWVzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcclxuICAgIGNvbnNvbGUudGltZSgnZmluZENhcGFiaWxpdHknKTtcclxuXHJcbiAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHsnY29kZSc6IGl0ZW0uY29kZX0seydyb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzJzowfSkubGVhbigpLmV4ZWMoKGVycjogYW55LCBpbmR1c3RyeTogYW55KT0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGluZHVzdHJ5Lmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1JlY29yZHMgYXJlIG5vdCBmb3VuZCcpLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW5kdXN0cnlbMF0ucm9sZXMuc29ydCgocjEgOiBSb2xlTW9kZWwsIHIyIDogUm9sZU1vZGVsKSA6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXIgPSA5OTk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnlbMF0ucm9sZXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29kZSBvZiBpdGVtLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNvZGUgPT0gcm9sZS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9sZV9vYmplY3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogcm9sZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiByb2xlLmNvZGUsXHJcbiAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdGllczogW10sXHJcbiAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IHJvbGUuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByb2xlX29iamVjdC5jYXBhYmlsaXRpZXMgPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgICByb2xlLmNhcGFiaWxpdGllcy5zb3J0KChyMSA6IENhcGFiaWxpdHlNb2RlbCwgcjIgOiBDYXBhYmlsaXR5TW9kZWwpIDogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ2luZHVzdHJ5TmFtZSc6IGluZHVzdHJ5WzBdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGVOYW1lJzogcm9sZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICdfaWQnOiBjYXBhYmlsaXR5Ll9pZCxcclxuICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IGNhcGFiaWxpdHkubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAnY29kZSc6IGNhcGFiaWxpdHkuY29kZSxcclxuICAgICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiBjYXBhYmlsaXR5LnNvcnRfb3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcy5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gocm9sZV9vYmplY3QpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaW5kQ2FwYWJpbGl0eScpO1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5pdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRDb21wbGV4aXRpZXMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLml0ZW1zID0gbmV3IEFycmF5KDApO1xyXG4gICAgY29uc29sZS50aW1lKCdmaW5kQ29tcGxleGl0eScpO1xyXG4gICAgSW5kdXN0cnlTY2hlbWEuZmluZCh7J2NvZGUnOiBpdGVtLmNvZGV9KS5sZWFuKCkuZXhlYygoZXJyOiBhbnksIGluZHVzdHJ5OiBhbnkpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaW5kdXN0cnkubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUmVjb3JkcyBhcmUgbm90IGZvdW5kJyksIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbmR1c3RyeVswXS5yb2xlcy5zb3J0KChyMSA6IFJvbGVNb2RlbCwgcjIgOiBSb2xlTW9kZWwpIDogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyeVswXS5yb2xlcykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2RlIG9mIGl0ZW0ucm9sZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY29kZSA9PSByb2xlLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCByb2xlX29iamVjdDogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiByb2xlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IHJvbGUuY29kZSxcclxuICAgICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzOiBbXSxcclxuICAgICAgICAgICAgICAgICAgc29ydF9vcmRlcjogcm9sZS5zb3J0X29yZGVyLFxyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0X2NvbXBsZXhpdGllczogcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJvbGUuY2FwYWJpbGl0aWVzLnNvcnQoKHIxIDogQ2FwYWJpbGl0eU1vZGVsLCByMiA6IENhcGFiaWxpdHlNb2RlbCkgOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9iIG9mIGl0ZW0uY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iID09IGNhcGFiaWxpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGNhcGFiaWxpdHlfb2JqZWN0OiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNhcGFiaWxpdHkubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY2FwYWJpbGl0eS5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiBjYXBhYmlsaXR5LnNvcnRfb3JkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXhpdGllczogW11cclxuICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5zb3J0KChyMSA6IENvbXBsZXhpdHlNb2RlbCwgcjIgOiBDb21wbGV4aXR5TW9kZWwpIDogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHIxLnNvcnRfb3JkZXI9OTk5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByMi5zb3J0X29yZGVyPTk5OTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eV9vYmplY3Q6IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb21wbGV4aXR5Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29tcGxleGl0eS5jb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRfb3JkZXI6IGNvbXBsZXhpdHkuc29ydF9vcmRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkZvckNhbmRpZGF0ZTogY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzY2VuYXJpb3M6IGNvbXBsZXhpdHkuc2NlbmFyaW9zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdHlfb2JqZWN0LmNvbXBsZXhpdGllcy5wdXNoKGNvbXBsZXhpdHlfb2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcy5wdXNoKGNhcGFiaWxpdHlfb2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2ZpbmRDb21wbGV4aXR5Jyk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzLml0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHJpdmVJbmR1c3RyaWVzV2l0aFNvcnRlZE9yZGVyKGV4Y2x1ZGVkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIEluZHVzdHJ5U2NoZW1hLmZpbmQoe30sIGV4Y2x1ZGVkKS5sZWFuKCkuZXhlYyhmdW5jdGlvbiAoZXJyOiBhbnksIGl0ZW1zOiBhbnkpIHtcclxuICAgICAgaXRlbXMuc29ydCgocjE6IGFueSwgcjI6IGFueSk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgaWYgKCFyMS5zb3J0X29yZGVyKSB7XHJcbiAgICAgICAgICByMS5zb3J0X29yZGVyID0gOTk5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXIyLnNvcnRfb3JkZXIpIHtcclxuICAgICAgICAgIHIyLnNvcnRfb3JkZXIgPSA5OTk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChOdW1iZXIocjEuc29ydF9vcmRlcikgPCBOdW1iZXIocjIuc29ydF9vcmRlcikpIHtcclxuICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE51bWJlcihyMS5zb3J0X29yZGVyKSA+IE51bWJlcihyMi5zb3J0X29yZGVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNhbGxiYWNrKGVyciwgaXRlbXMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5PYmplY3Quc2VhbChJbmR1c3RyeVJlcG9zaXRvcnkpO1xyXG5leHBvcnQgPSBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiJdfQ==
