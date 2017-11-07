"use strict";
var CNextMessages = require("../shared/cnext-messages");
var ProjectAsset = require("../shared/projectasset");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var IndustryService = (function () {
    function IndustryService() {
        this.industryRepository = new IndustryRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    IndustryService.prototype.retrieveAll = function (field, callback) {
        this.industryRepository.retriveIndustriesWithSortedOrder({ roles: 0, proficiencies: 0 }, callback);
    };
    IndustryService.prototype.retrieve = function (field, callback) {
        this.industryRepository.retrieve(field, callback);
    };
    IndustryService.prototype.findByName = function (field, callback) {
        this.industryRepository.findByName(field, callback);
    };
    IndustryService.prototype.pushIntoArray = function (name, value, callback) {
        this.industryRepository.pushElementInArray(value, callback);
    };
    IndustryService.prototype.create = function (item, callback) {
        var _this = this;
        this.industryRepository.retrieve({ 'code': item.code }, function (errinCreate, response) {
            if (errinCreate) {
                callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
            }
            else {
                if (response.length === 0) {
                    _this.industryRepository.create(item, function (err, res) {
                        if (err) {
                            callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
                        }
                        else {
                            callback(null, res);
                        }
                    });
                }
                else {
                    _this.industryRepository.findOneAndUpdate({ '_id': response[0]._id }, item, { new: true }, callback);
                }
            }
        });
    };
    IndustryService.prototype.getReleventIndustryList = function (data, industryName, callback) {
        var query = { 'roles.code': { $in: JSON.parse(data) } };
        this.industryRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                var industries = new Array(0);
                if (res.length > 0) {
                    for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                        var item = res_1[_i];
                        if (industryName !== item.name) {
                            var obj = { name: item.name };
                            industries.push(obj);
                        }
                    }
                    callback(null, industries);
                }
                else {
                    var industries_1 = new Array(0);
                    callback(null, industries_1);
                }
            }
        });
    };
    return IndustryService;
}());
Object.seal(IndustryService);
module.exports = IndustryService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvaW5kdXN0cnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0RBQTJEO0FBQzNELHFEQUF3RDtBQUN4RCxpRkFBb0Y7QUFDcEY7SUFJRTtRQUNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxxQ0FBVyxHQUFYLFVBQVksS0FBVSxFQUFFLFFBQTJDO1FBQ2pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRCxrQ0FBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxvQ0FBVSxHQUFWLFVBQVcsS0FBVSxFQUFFLFFBQTJDO1FBQ2hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFJRCx1Q0FBYSxHQUFiLFVBQWMsSUFBUyxFQUFFLEtBQWEsRUFBRSxRQUEyQztRQUNqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxnQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQTdELGlCQW1CQztRQWpCQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFDLFdBQWdCLEVBQUUsUUFBYTtZQUN2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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ05leHRNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jbmV4dC1tZXNzYWdlcycpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xuY2xhc3MgSW5kdXN0cnlTZXJ2aWNlIHtcbiAgQVBQX05BTUU6IHN0cmluZztcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRvcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xuICB9XG4vL3RvIGRvIHJldHJpZXZlIGFsbCBwYXJhbWV0ZXIgbGlzdFxuICByZXRyaWV2ZUFsbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cml2ZUluZHVzdHJpZXNXaXRoU29ydGVkT3JkZXIoe3JvbGVzOiAwLHByb2ZpY2llbmNpZXM6IDB9LCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRCeU5hbWUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRCeU5hbWUoZmllbGQsIGNhbGxiYWNrKTtcbiAgfVxuICAvLyB0b2RvIHJlbW92ZSB1bndhbnRlZCBtZXRob2RzIGFuZCBkYXRhXG4gIC8vIHRvZG8gYWxsIGRhdyBsYXllciBjb2RlIHRvIHNlcnZpY2Vcbi8vcHVzaGludG8gQXJyYXkgY2hlY2tcbiAgcHVzaEludG9BcnJheShuYW1lOiBhbnksIHZhbHVlOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5wdXNoRWxlbWVudEluQXJyYXkodmFsdWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNyZWF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcblxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LnJldHJpZXZlKHsgJ2NvZGUnIDogaXRlbS5jb2RlIH0sIChlcnJpbkNyZWF0ZTogYW55LCByZXNwb25zZTogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyaW5DcmVhdGUpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKENOZXh0TWVzc2FnZXMuUFJPQkxFTV9JTl9DUkVBVElOR19JTkRVU1RSWSksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKENOZXh0TWVzc2FnZXMuUFJPQkxFTV9JTl9DUkVBVElOR19JTkRVU1RSWSksIG51bGwpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeydfaWQnOiByZXNwb25zZVswXS5faWR9LCBpdGVtLCB7bmV3OiB0cnVlfSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRSZWxldmVudEluZHVzdHJ5TGlzdChkYXRhOiBhbnksaW5kdXN0cnlOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcblxuICAgIGxldCBxdWVyeSA9IHsgJ3JvbGVzLmNvZGUnOiB7JGluIDpKU09OLnBhcnNlKGRhdGEpfX07XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGluZHVzdHJpZXM6YW55W10gPSBuZXcgQXJyYXkoMCk7XG4gICAgICAgIGlmKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXMpIHtcbiAgICAgICAgICAgIGlmKGluZHVzdHJ5TmFtZSAhPT0gaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICAgIGxldCBvYmogPSB7bmFtZTogaXRlbS5uYW1lfTtcbiAgICAgICAgICAgICAgaW5kdXN0cmllcy5wdXNoKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGluZHVzdHJpZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBpbmR1c3RyaWVzIDogYW55W10gPSBuZXcgQXJyYXkoMCk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaW5kdXN0cmllcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG59XG5cbk9iamVjdC5zZWFsKEluZHVzdHJ5U2VydmljZSk7XG5leHBvcnQgPSBJbmR1c3RyeVNlcnZpY2U7XG4iXX0=
