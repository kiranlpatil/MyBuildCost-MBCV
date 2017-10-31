"use strict";
var share_1 = require("../model/share");
var CandidateRepository = require("../../dataaccess/repository/candidate.repository");
var ShareLinkRepository = require("../../dataaccess/repository/share-link.repository");
var Messages = require("../../shared/messages");
var ShareService = (function () {
    function ShareService() {
        this.shareDetails = new share_1.Share();
        this.candidateRepository = new CandidateRepository();
        this.shareLinkRepository = new ShareLinkRepository();
    }
    ShareService.prototype.buildValuePortraitUrl = function (host, access_token, user, res, callback) {
        var _this = this;
        var actualUrl = 'value-portrait' + '/' + user._id + '?access_token=' + access_token;
        var _date = new Date();
        var _miliSeconds = _date.getTime().toString();
        this.shareDetails.first_name = user.first_name;
        this.shareDetails.last_name = user.last_name;
        this.shareDetails.isVisible = res[0].isVisible;
        var _shortString = _miliSeconds;
        this.shareDetails.shareUrl = host + 'share' + '/' + _shortString;
        var _item = {
            shortUrl: _shortString,
            longUrl: actualUrl
        };
        this.shareLinkRepository.create(_item, function (err, res) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_IF_STORE_TO_SHARE_LINK_FAILED), null);
            }
            else {
                callback(null, _this.shareDetails);
            }
        });
    };
    ShareService.prototype.buildShareJobUrl = function (host, access_token, user, jobId, callback) {
        var _this = this;
        var actualUrl = 'jobPost' + '/' + user._id + '/' + jobId + '?access_token=' + access_token;
        var _date = new Date();
        var _miliSeconds = _date.getTime().toString();
        var _shortString = _miliSeconds + user._id;
        this.shareDetails.shareUrl = host + 'editJob' + '/' + _shortString;
        var _item = {
            shortUrl: _shortString,
            longUrl: actualUrl,
        };
        this.shareLinkRepository.create(_item, function (err, res) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_IF_STORE_TO_SHARE_LINK_FAILED), null);
            }
            else {
                callback(null, _this.shareDetails);
            }
        });
    };
    ShareService.prototype.retrieve = function (field, callback) {
        this.candidateRepository.retrieveWithoutLean(field, callback);
    };
    ShareService.prototype.retrieveUrl = function (field, callback) {
        this.shareLinkRepository.retrieveWithoutLean(field, callback);
    };
    ShareService.prototype.findOneAndUpdate = function (field, callback) {
        this.shareLinkRepository.findOneAndUpdate(field, { 'isJobPosted': true }, { new: true }, callback);
    };
    return ShareService;
}());
module.exports = ShareService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmUvc2VydmljZXMvc2hhcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXFDO0FBQ3JDLHNGQUF5RjtBQUV6Rix1RkFBMEY7QUFDMUYsZ0RBQW1EO0FBRW5EO0lBS0U7UUFKUSxpQkFBWSxHQUFTLElBQUksYUFBSyxFQUFFLENBQUM7UUFLdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCw0Q0FBcUIsR0FBckIsVUFBc0IsSUFBVyxFQUFFLFlBQW1CLEVBQUUsSUFBUSxFQUFFLEdBQXlCLEVBQUUsUUFBMEM7UUFBdkksaUJBdUJDO1FBdEJDLElBQUksU0FBUyxHQUFVLGdCQUFnQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFnQixHQUFHLFlBQVksQ0FBQztRQUczRixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksWUFBWSxHQUFVLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVyRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFlBQVksR0FBVSxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDO1FBQ2pFLElBQUksS0FBSyxHQUFPO1lBQ2QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDOUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLHVDQUF1QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsSUFBVyxFQUFFLFlBQW1CLEVBQUUsSUFBUSxFQUFDLEtBQVksRUFBRSxRQUEwQztRQUFwSCxpQkFpQkM7UUFoQkMsSUFBSSxTQUFTLEdBQVUsU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFFLEdBQUcsR0FBRyxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDO1FBQ2pHLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxZQUFZLEdBQVUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JELElBQUksWUFBWSxHQUFVLFlBQVksR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQztRQUNuRSxJQUFJLEtBQUssR0FBTztZQUNkLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE9BQU8sRUFBRSxTQUFTO1NBQ25CLENBQUM7UUFDRixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQVMsRUFBRSxRQUF3QztRQUMxRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxrQ0FBVyxHQUFYLFVBQVksS0FBUyxFQUFFLFFBQXdDO1FBQzdELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELHVDQUFnQixHQUFoQixVQUFpQixLQUFTLEVBQUUsUUFBd0M7UUFDbEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBQyxFQUFDLGFBQWEsRUFBQyxJQUFJLEVBQUMsRUFBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUgsbUJBQUM7QUFBRCxDQWhFQSxBQWdFQyxJQUFBO0FBRUQsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmUvc2VydmljZXMvc2hhcmUuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2hhcmV9IGZyb20gXCIuLi9tb2RlbC9zaGFyZVwiO1xyXG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBTaGFyZUxpbmtSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9zaGFyZS1saW5rLnJlcG9zaXRvcnlcIik7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoXCIuLi8uLi9zaGFyZWQvbWVzc2FnZXNcIik7XHJcblxyXG5jbGFzcyBTaGFyZVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgc2hhcmVEZXRhaWxzOlNoYXJlID0gbmV3IFNoYXJlKCk7XHJcbiAgcHJpdmF0ZSBjYW5kaWRhdGVSZXBvc2l0b3J5OkNhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBzaGFyZUxpbmtSZXBvc2l0b3J5OlNoYXJlTGlua1JlcG9zaXRvcnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuc2hhcmVMaW5rUmVwb3NpdG9yeSA9IG5ldyBTaGFyZUxpbmtSZXBvc2l0b3J5KCk7XHJcbiAgfVxyXG5cclxuICBidWlsZFZhbHVlUG9ydHJhaXRVcmwoaG9zdDpzdHJpbmcsIGFjY2Vzc190b2tlbjpzdHJpbmcsIHVzZXI6YW55LCByZXM6Q2FuZGlkYXRlQ2xhc3NNb2RlbFtdLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6U2hhcmUpID0+IHZvaWQpIHtcclxuICAgIGxldCBhY3R1YWxVcmw6c3RyaW5nID0gJ3ZhbHVlLXBvcnRyYWl0JyArICcvJyArIHVzZXIuX2lkICsgJz9hY2Nlc3NfdG9rZW49JyArIGFjY2Vzc190b2tlbjtcclxuICAgIC8vbGV0IHVybEZvclNoYXJlID0gaG9zdCArICd2YWx1ZS1wb3J0cmFpdCcgKyAnLycgKyB1c2VyLl9pZCArICc/YWNjZXNzX3Rva2VuPScgKyBhY2Nlc3NfdG9rZW47XHJcblxyXG4gICAgbGV0IF9kYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBfbWlsaVNlY29uZHM6c3RyaW5nID0gX2RhdGUuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgdGhpcy5zaGFyZURldGFpbHMuZmlyc3RfbmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcclxuICAgIHRoaXMuc2hhcmVEZXRhaWxzLmxhc3RfbmFtZSA9IHVzZXIubGFzdF9uYW1lO1xyXG4gICAgdGhpcy5zaGFyZURldGFpbHMuaXNWaXNpYmxlID0gcmVzWzBdLmlzVmlzaWJsZTtcclxuICAgIGxldCBfc2hvcnRTdHJpbmc6c3RyaW5nID0gX21pbGlTZWNvbmRzO1xyXG4gICAgdGhpcy5zaGFyZURldGFpbHMuc2hhcmVVcmwgPSBob3N0ICsgJ3NoYXJlJyArICcvJyArIF9zaG9ydFN0cmluZztcclxuICAgIGxldCBfaXRlbTphbnkgPSB7XHJcbiAgICAgIHNob3J0VXJsOiBfc2hvcnRTdHJpbmcsXHJcbiAgICAgIGxvbmdVcmw6IGFjdHVhbFVybFxyXG4gICAgfTtcclxuICAgIHRoaXMuc2hhcmVMaW5rUmVwb3NpdG9yeS5jcmVhdGUoX2l0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9JRl9TVE9SRV9UT19TSEFSRV9MSU5LX0ZBSUxFRCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuc2hhcmVEZXRhaWxzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGJ1aWxkU2hhcmVKb2JVcmwoaG9zdDpzdHJpbmcsIGFjY2Vzc190b2tlbjpzdHJpbmcsIHVzZXI6YW55LGpvYklkOnN0cmluZyAsY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OlNoYXJlKSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgYWN0dWFsVXJsOnN0cmluZyA9ICdqb2JQb3N0JyArICcvJyArIHVzZXIuX2lkICsnLycgKyBqb2JJZCArICc/YWNjZXNzX3Rva2VuPScgKyBhY2Nlc3NfdG9rZW47XHJcbiAgICBsZXQgX2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IF9taWxpU2Vjb25kczpzdHJpbmcgPSBfZGF0ZS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcclxuICAgIGxldCBfc2hvcnRTdHJpbmc6c3RyaW5nID0gX21pbGlTZWNvbmRzK3VzZXIuX2lkO1xyXG4gICAgdGhpcy5zaGFyZURldGFpbHMuc2hhcmVVcmwgPSBob3N0ICsgJ2VkaXRKb2InICsgJy8nICsgX3Nob3J0U3RyaW5nO1xyXG4gICAgbGV0IF9pdGVtOmFueSA9IHtcclxuICAgICAgc2hvcnRVcmw6IF9zaG9ydFN0cmluZyxcclxuICAgICAgbG9uZ1VybDogYWN0dWFsVXJsLFxyXG4gICAgfTtcclxuICAgIHRoaXMuc2hhcmVMaW5rUmVwb3NpdG9yeS5jcmVhdGUoX2l0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9JRl9TVE9SRV9UT19TSEFSRV9MSU5LX0ZBSUxFRCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuc2hhcmVEZXRhaWxzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhvdXRMZWFuKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVVybChmaWVsZDphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuc2hhcmVMaW5rUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhvdXRMZWFuKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG4gIGZpbmRPbmVBbmRVcGRhdGUoZmllbGQ6YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnNoYXJlTGlua1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShmaWVsZCx7J2lzSm9iUG9zdGVkJzp0cnVlfSx7bmV3OiB0cnVlfSAsY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbn1cclxuLy9PYmplY3Quc2VhbChTaGFyZVNlcnZpY2UpO1xyXG5leHBvcnQgPSBTaGFyZVNlcnZpY2U7XHJcbiJdfQ==
