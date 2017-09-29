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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyREFBOEQ7QUFDOUQsdURBQTBEO0FBTTFEO0lBQWlDLHNDQUF5QjtJQUd4RDtlQUNFLGtCQUFNLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUQsc0NBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxRQUEyQztRQUFuRSxpQkF3Q0M7UUF2Q0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEVBQUMsRUFBQyxvQkFBb0IsRUFBQyxDQUFDLEVBQUMsNEJBQTRCLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFRLEVBQUUsUUFBYTtZQUM5SCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFjLEVBQUUsRUFBYzt3QkFDcEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENB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LEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgseUJBQUM7QUFBRCxDQXJQQSxBQXFQQyxDQXJQZ0MsY0FBYyxHQXFQOUM7QUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsaUJBQVMsa0JBQWtCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbmR1c3RyeVNjaGVtYSA9IHJlcXVpcmUoJy4uL3NjaGVtYXMvaW5kdXN0cnkuc2NoZW1hJyk7XG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKCcuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlJyk7XG5pbXBvcnQgSUluZHVzdHJ5ID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvaW5kdXN0cnknKTtcbmltcG9ydCBSb2xlTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9yb2xlLm1vZGVsJyk7XG5pbXBvcnQgQ2FwYWJpbGl0eU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2NhcGFiaWxpdHkubW9kZWxcIik7XG5pbXBvcnQgQ29tcGxleGl0eU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2NvbXBsZXhpdHkubW9kZWxcIik7XG5cbmNsYXNzIEluZHVzdHJ5UmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElJbmR1c3RyeT4ge1xuICBwcml2YXRlIGl0ZW1zOiBSb2xlTW9kZWxbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJbmR1c3RyeVNjaGVtYSk7XG4gIH1cblxuICBmaW5kUm9sZXMoY29kZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcbiAgICBjb25zb2xlLnRpbWUoJ2ZpbmRSb2xlJyk7XG4gICAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHsnY29kZSc6IGNvZGV9LHsncm9sZXMuY2FwYWJpbGl0aWVzJzowLCdyb2xlcy5kZWZhdWx0X2NvbXBsZXhpdGllcyc6MH0pLmxlYW4oKS5leGVjKChlcnI6IGFueSwgaW5kdXN0cnk6IGFueSk9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdSZWNvcmRzIGFyZSBub3QgZm91bmQnKSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICBpZighcjEuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoIXIyLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPCByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHIxLnNvcnRfb3JkZXIgPiByMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XG4gICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAnaW5kdXN0cnlOYW1lJzogaW5kdXN0cnlbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICAnX2lkJzogcm9sZS5faWQsXG4gICAgICAgICAgICAgICAgJ3NvcnRfb3JkZXInOiByb2xlLnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgJ25hbWUnOiByb2xlLm5hbWUsXG4gICAgICAgICAgICAgICAgJ2NvZGUnOiByb2xlLmNvZGUsXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaW5kUm9sZScpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpcy5pdGVtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGZpbmRDYXBhYmlsaXRpZXMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pdGVtcyA9IG5ldyBBcnJheSgwKTtcbiAgICBjb25zb2xlLnRpbWUoJ2ZpbmRDYXBhYmlsaXR5Jyk7XG5cbiAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHsnY29kZSc6IGl0ZW0uY29kZX0seydyb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzJzowfSkubGVhbigpLmV4ZWMoKGVycjogYW55LCBpbmR1c3RyeTogYW55KT0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUmVjb3JkcyBhcmUgbm90IGZvdW5kJyksIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXIgPSA5OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2RlIG9mIGl0ZW0ucm9sZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGNvZGUgPT0gcm9sZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvbGVfb2JqZWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb2xlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjb2RlOiByb2xlLmNvZGUsXG4gICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgc29ydF9vcmRlcjogcm9sZS5zb3J0X29yZGVyLFxuICAgICAgICAgICAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcyA9IG5ldyBBcnJheSgwKTtcbiAgICAgICAgICAgICAgICByb2xlLmNhcGFiaWxpdGllcy5zb3J0KChyMSA6IENhcGFiaWxpdHlNb2RlbCwgcjIgOiBDYXBhYmlsaXR5TW9kZWwpIDogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xuICAgICAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICAnaW5kdXN0cnlOYW1lJzogaW5kdXN0cnlbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGVOYW1lJzogcm9sZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAnX2lkJzogY2FwYWJpbGl0eS5faWQsXG4gICAgICAgICAgICAgICAgICAgICduYW1lJzogY2FwYWJpbGl0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAnY29kZSc6IGNhcGFiaWxpdHkuY29kZSxcbiAgICAgICAgICAgICAgICAgICAgc29ydF9vcmRlcjogY2FwYWJpbGl0eS5zb3J0X29yZGVyLFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIHJvbGVfb2JqZWN0LmNhcGFiaWxpdGllcy5wdXNoKG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaW5kQ2FwYWJpbGl0eScpO1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmaW5kQ29tcGxleGl0aWVzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgQXJyYXkoMCk7XG4gICAgY29uc29sZS50aW1lKCdmaW5kQ29tcGxleGl0eScpO1xuICAgIEluZHVzdHJ5U2NoZW1hLmZpbmQoeydjb2RlJzogaXRlbS5jb2RlfSkubGVhbigpLmV4ZWMoKGVycjogYW55LCBpbmR1c3RyeTogYW55KT0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbmR1c3RyeS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUmVjb3JkcyBhcmUgbm90IGZvdW5kJyksIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZHVzdHJ5WzBdLnJvbGVzLnNvcnQoKHIxIDogUm9sZU1vZGVsLCByMiA6IFJvbGVNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgcjIuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5WzBdLnJvbGVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2RlIG9mIGl0ZW0ucm9sZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGNvZGUgPT0gcm9sZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvbGVfb2JqZWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb2xlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjb2RlOiByb2xlLmNvZGUsXG4gICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgc29ydF9vcmRlcjogcm9sZS5zb3J0X29yZGVyLFxuICAgICAgICAgICAgICAgICAgZGVmYXVsdF9jb21wbGV4aXRpZXM6IHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJvbGUuY2FwYWJpbGl0aWVzLnNvcnQoKHIxIDogQ2FwYWJpbGl0eU1vZGVsLCByMiA6IENhcGFiaWxpdHlNb2RlbCkgOiBudW1iZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYoIXIxLnNvcnRfb3JkZXIpe1xuICAgICAgICAgICAgICAgICAgICByMS5zb3J0X29yZGVyPTk5OTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmKCFyMi5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgcjIuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyIDwgcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZihyMS5zb3J0X29yZGVyID4gcjIuc29ydF9vcmRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBvYiBvZiBpdGVtLmNhcGFiaWxpdGllcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2IgPT0gY2FwYWJpbGl0eS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGNhcGFiaWxpdHlfb2JqZWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBjYXBhYmlsaXR5Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjYXBhYmlsaXR5LmNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiBjYXBhYmlsaXR5LnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV4aXRpZXM6IFtdXG4gICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5zb3J0KChyMSA6IENvbXBsZXhpdHlNb2RlbCwgcjIgOiBDb21wbGV4aXR5TW9kZWwpIDogbnVtYmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFyMS5zb3J0X29yZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcjEuc29ydF9vcmRlcj05OTk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcjIuc29ydF9vcmRlcil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHIyLnNvcnRfb3JkZXI9OTk5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA8IHIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocjEuc29ydF9vcmRlciA+IHIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBsZXhpdHlfb2JqZWN0OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbXBsZXhpdHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29tcGxleGl0eS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3J0X29yZGVyOiBjb21wbGV4aXR5LnNvcnRfb3JkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uRm9yQ2FuZGlkYXRlOiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkZvclJlY3J1aXRlcjogY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmFyaW9zOiBjb21wbGV4aXR5LnNjZW5hcmlvc1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdHlfb2JqZWN0LmNvbXBsZXhpdGllcy5wdXNoKGNvbXBsZXhpdHlfb2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgcm9sZV9vYmplY3QuY2FwYWJpbGl0aWVzLnB1c2goY2FwYWJpbGl0eV9vYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChyb2xlX29iamVjdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCdmaW5kQ29tcGxleGl0eScpO1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuaXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpdmVJbmR1c3RyaWVzV2l0aFNvcnRlZE9yZGVyKGV4Y2x1ZGVkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBJbmR1c3RyeVNjaGVtYS5maW5kKHt9LCBleGNsdWRlZCkubGVhbigpLmV4ZWMoZnVuY3Rpb24gKGVycjogYW55LCBpdGVtczogYW55KSB7XG4gICAgICBpdGVtcy5zb3J0KChyMTogYW55LCByMjogYW55KTogbnVtYmVyID0+IHtcbiAgICAgICAgaWYgKCFyMS5zb3J0X29yZGVyKSB7XG4gICAgICAgICAgcjEuc29ydF9vcmRlciA9IDk5OTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXIyLnNvcnRfb3JkZXIpIHtcbiAgICAgICAgICByMi5zb3J0X29yZGVyID0gOTk5O1xuICAgICAgICB9XG4gICAgICAgIGlmIChOdW1iZXIocjEuc29ydF9vcmRlcikgPCBOdW1iZXIocjIuc29ydF9vcmRlcikpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE51bWJlcihyMS5zb3J0X29yZGVyKSA+IE51bWJlcihyMi5zb3J0X29yZGVyKSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0pO1xuICAgICAgY2FsbGJhY2soZXJyLCBpdGVtcyk7XG4gICAgfSk7XG4gIH1cblxufVxuT2JqZWN0LnNlYWwoSW5kdXN0cnlSZXBvc2l0b3J5KTtcbmV4cG9ydCA9IEluZHVzdHJ5UmVwb3NpdG9yeTtcbiJdfQ==
