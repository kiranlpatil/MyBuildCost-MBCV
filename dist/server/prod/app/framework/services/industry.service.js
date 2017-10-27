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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvaW5kdXN0cnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0RBQTJEO0FBQzNELHFEQUF3RDtBQUN4RCxpRkFBb0Y7QUFDcEY7SUFJRTtRQUNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxxQ0FBVyxHQUFYLFVBQVksS0FBVSxFQUFFLFFBQTJDO1FBQ2pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFFLENBQUMsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFFRCxrQ0FBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxvQ0FBVSxHQUFWLFVBQVcsS0FBVSxFQUFFLFFBQTJDO1FBQ2hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFJRCx1Q0FBYSxHQUFiLFVBQWMsSUFBUyxFQUFFLEtBQWEsRUFBRSxRQUEyQztRQUNqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxnQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQTdELGlCQW1CQztRQWpCQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFDLFdBQWdCLEVBQUUsUUFBYTtZQUN2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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ05leHRNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jbmV4dC1tZXNzYWdlcycpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Byb2plY3Rhc3NldCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuY2xhc3MgSW5kdXN0cnlTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gIH1cclxuLy90byBkbyByZXRyaWV2ZSBhbGwgcGFyYW1ldGVyIGxpc3RcclxuICByZXRyaWV2ZUFsbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaXZlSW5kdXN0cmllc1dpdGhTb3J0ZWRPcmRlcih7cm9sZXM6IDAscHJvZmljaWVuY2llczogMH0sIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kQnlOYW1lKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRCeU5hbWUoZmllbGQsIGNhbGxiYWNrKTtcclxuICB9XHJcbiAgLy8gdG9kbyByZW1vdmUgdW53YW50ZWQgbWV0aG9kcyBhbmQgZGF0YVxyXG4gIC8vIHRvZG8gYWxsIGRhdyBsYXllciBjb2RlIHRvIHNlcnZpY2VcclxuLy9wdXNoaW50byBBcnJheSBjaGVja1xyXG4gIHB1c2hJbnRvQXJyYXkobmFtZTogYW55LCB2YWx1ZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5wdXNoRWxlbWVudEluQXJyYXkodmFsdWUsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7ICdjb2RlJyA6IGl0ZW0uY29kZSB9LCAoZXJyaW5DcmVhdGU6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyaW5DcmVhdGUpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoQ05leHRNZXNzYWdlcy5QUk9CTEVNX0lOX0NSRUFUSU5HX0lORFVTVFJZKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKENOZXh0TWVzc2FnZXMuUFJPQkxFTV9JTl9DUkVBVElOR19JTkRVU1RSWSksIG51bGwpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeydfaWQnOiByZXNwb25zZVswXS5faWR9LCBpdGVtLCB7bmV3OiB0cnVlfSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWxldmVudEluZHVzdHJ5TGlzdChkYXRhOiBhbnksaW5kdXN0cnlOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7ICdyb2xlcy5jb2RlJzogeyRpbiA6SlNPTi5wYXJzZShkYXRhKX19O1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgaW5kdXN0cmllczphbnlbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICBpZihyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yIChsZXQgaXRlbSBvZiByZXMpIHtcclxuICAgICAgICAgICAgaWYoaW5kdXN0cnlOYW1lICE9PSBpdGVtLm5hbWUpIHtcclxuICAgICAgICAgICAgICBsZXQgb2JqID0ge25hbWU6IGl0ZW0ubmFtZX07XHJcbiAgICAgICAgICAgICAgaW5kdXN0cmllcy5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGluZHVzdHJpZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaW5kdXN0cmllcyA6IGFueVtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaW5kdXN0cmllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChJbmR1c3RyeVNlcnZpY2UpO1xyXG5leHBvcnQgPSBJbmR1c3RyeVNlcnZpY2U7XHJcbiJdfQ==
