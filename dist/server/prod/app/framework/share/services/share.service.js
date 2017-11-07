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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmUvc2VydmljZXMvc2hhcmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXFDO0FBQ3JDLHNGQUF5RjtBQUV6Rix1RkFBMEY7QUFDMUYsZ0RBQW1EO0FBRW5EO0lBS0U7UUFKUSxpQkFBWSxHQUFTLElBQUksYUFBSyxFQUFFLENBQUM7UUFLdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCw0Q0FBcUIsR0FBckIsVUFBc0IsSUFBVyxFQUFFLFlBQW1CLEVBQUUsSUFBUSxFQUFFLEdBQXlCLEVBQUUsUUFBMEM7UUFBdkksaUJBdUJDO1FBdEJDLElBQUksU0FBUyxHQUFVLGdCQUFnQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFnQixHQUFHLFlBQVksQ0FBQztRQUczRixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksWUFBWSxHQUFVLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVyRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMvQyxJQUFJLFlBQVksR0FBVSxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDO1FBQ2pFLElBQUksS0FBSyxHQUFPO1lBQ2QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQztRQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDOUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLHVDQUF1QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsSUFBVyxFQUFFLFlBQW1CLEVBQUUsSUFBUSxFQUFDLEtBQVksRUFBRSxRQUEwQztRQUFwSCxpQkFpQkM7UUFoQkMsSUFBSSxTQUFTLEdBQVUsU0FBUyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFFLEdBQUcsR0FBRyxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDO1FBQ2pHLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxZQUFZLEdBQVUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JELElBQUksWUFBWSxHQUFVLFlBQVksR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQztRQUNuRSxJQUFJLEtBQUssR0FBTztZQUNkLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE9BQU8sRUFBRSxTQUFTO1NBQ25CLENBQUM7UUFDRixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQVMsRUFBRSxRQUF3QztRQUMxRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxrQ0FBVyxHQUFYLFVBQVksS0FBUyxFQUFFLFFBQXdDO1FBQzdELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELHVDQUFnQixHQUFoQixVQUFpQixLQUFTLEVBQUUsUUFBd0M7UUFDbEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBQyxFQUFDLGFBQWEsRUFBQyxJQUFJLEVBQUMsRUFBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUgsbUJBQUM7QUFBRCxDQWhFQSxBQWdFQyxJQUFBO0FBRUQsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmUvc2VydmljZXMvc2hhcmUuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2hhcmV9IGZyb20gXCIuLi9tb2RlbC9zaGFyZVwiO1xuaW1wb3J0IENhbmRpZGF0ZVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnknKTtcbmltcG9ydCBDYW5kaWRhdGVDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtY2xhc3MubW9kZWwnKTtcbmltcG9ydCBTaGFyZUxpbmtSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9zaGFyZS1saW5rLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKFwiLi4vLi4vc2hhcmVkL21lc3NhZ2VzXCIpO1xuXG5jbGFzcyBTaGFyZVNlcnZpY2Uge1xuICBwcml2YXRlIHNoYXJlRGV0YWlsczpTaGFyZSA9IG5ldyBTaGFyZSgpO1xuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6Q2FuZGlkYXRlUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBzaGFyZUxpbmtSZXBvc2l0b3J5OlNoYXJlTGlua1JlcG9zaXRvcnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLnNoYXJlTGlua1JlcG9zaXRvcnkgPSBuZXcgU2hhcmVMaW5rUmVwb3NpdG9yeSgpO1xuICB9XG5cbiAgYnVpbGRWYWx1ZVBvcnRyYWl0VXJsKGhvc3Q6c3RyaW5nLCBhY2Nlc3NfdG9rZW46c3RyaW5nLCB1c2VyOmFueSwgcmVzOkNhbmRpZGF0ZUNsYXNzTW9kZWxbXSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OlNoYXJlKSA9PiB2b2lkKSB7XG4gICAgbGV0IGFjdHVhbFVybDpzdHJpbmcgPSAndmFsdWUtcG9ydHJhaXQnICsgJy8nICsgdXNlci5faWQgKyAnP2FjY2Vzc190b2tlbj0nICsgYWNjZXNzX3Rva2VuO1xuICAgIC8vbGV0IHVybEZvclNoYXJlID0gaG9zdCArICd2YWx1ZS1wb3J0cmFpdCcgKyAnLycgKyB1c2VyLl9pZCArICc/YWNjZXNzX3Rva2VuPScgKyBhY2Nlc3NfdG9rZW47XG5cbiAgICBsZXQgX2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBfbWlsaVNlY29uZHM6c3RyaW5nID0gX2RhdGUuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG5cbiAgICB0aGlzLnNoYXJlRGV0YWlscy5maXJzdF9uYW1lID0gdXNlci5maXJzdF9uYW1lO1xuICAgIHRoaXMuc2hhcmVEZXRhaWxzLmxhc3RfbmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgIHRoaXMuc2hhcmVEZXRhaWxzLmlzVmlzaWJsZSA9IHJlc1swXS5pc1Zpc2libGU7XG4gICAgbGV0IF9zaG9ydFN0cmluZzpzdHJpbmcgPSBfbWlsaVNlY29uZHM7XG4gICAgdGhpcy5zaGFyZURldGFpbHMuc2hhcmVVcmwgPSBob3N0ICsgJ3NoYXJlJyArICcvJyArIF9zaG9ydFN0cmluZztcbiAgICBsZXQgX2l0ZW06YW55ID0ge1xuICAgICAgc2hvcnRVcmw6IF9zaG9ydFN0cmluZyxcbiAgICAgIGxvbmdVcmw6IGFjdHVhbFVybFxuICAgIH07XG4gICAgdGhpcy5zaGFyZUxpbmtSZXBvc2l0b3J5LmNyZWF0ZShfaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfSUZfU1RPUkVfVE9fU0hBUkVfTElOS19GQUlMRUQpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuc2hhcmVEZXRhaWxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBidWlsZFNoYXJlSm9iVXJsKGhvc3Q6c3RyaW5nLCBhY2Nlc3NfdG9rZW46c3RyaW5nLCB1c2VyOmFueSxqb2JJZDpzdHJpbmcgLGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDpTaGFyZSkgPT4gdm9pZCkge1xuICAgIGxldCBhY3R1YWxVcmw6c3RyaW5nID0gJ2pvYlBvc3QnICsgJy8nICsgdXNlci5faWQgKycvJyArIGpvYklkICsgJz9hY2Nlc3NfdG9rZW49JyArIGFjY2Vzc190b2tlbjtcbiAgICBsZXQgX2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBfbWlsaVNlY29uZHM6c3RyaW5nID0gX2RhdGUuZ2V0VGltZSgpLnRvU3RyaW5nKCk7XG4gICAgbGV0IF9zaG9ydFN0cmluZzpzdHJpbmcgPSBfbWlsaVNlY29uZHMrdXNlci5faWQ7XG4gICAgdGhpcy5zaGFyZURldGFpbHMuc2hhcmVVcmwgPSBob3N0ICsgJ2VkaXRKb2InICsgJy8nICsgX3Nob3J0U3RyaW5nO1xuICAgIGxldCBfaXRlbTphbnkgPSB7XG4gICAgICBzaG9ydFVybDogX3Nob3J0U3RyaW5nLFxuICAgICAgbG9uZ1VybDogYWN0dWFsVXJsLFxuICAgIH07XG4gICAgdGhpcy5zaGFyZUxpbmtSZXBvc2l0b3J5LmNyZWF0ZShfaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfSUZfU1RPUkVfVE9fU0hBUkVfTElOS19GQUlMRUQpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHRoaXMuc2hhcmVEZXRhaWxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpZXZlKGZpZWxkOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhvdXRMZWFuKGZpZWxkLCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZVVybChmaWVsZDphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnNoYXJlTGlua1JlcG9zaXRvcnkucmV0cmlldmVXaXRob3V0TGVhbihmaWVsZCwgY2FsbGJhY2spO1xuICB9XG4gIGZpbmRPbmVBbmRVcGRhdGUoZmllbGQ6YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5zaGFyZUxpbmtSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoZmllbGQseydpc0pvYlBvc3RlZCc6dHJ1ZX0se25ldzogdHJ1ZX0gLGNhbGxiYWNrKTtcbiAgfVxuXG59XG4vL09iamVjdC5zZWFsKFNoYXJlU2VydmljZSk7XG5leHBvcnQgPSBTaGFyZVNlcnZpY2U7XG4iXX0=
