"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var UserRepository = require("../dataaccess/repository/user.repository");
var LoggerService = require("../shared/logger/LoggerService");
var _loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');
var CronJob = require('cron').CronJob;
var config = require('config');
var mailchimp = require('mailchimp-api-v3');
var mailchimpClient = new mailchimp(config.get('TplSeed.mail.MAIL_CHIMP_SERVICE_KEY'));
var md5 = require('md5');
var MailChimpMailerService = (function () {
    function MailChimpMailerService() {
    }
    MailChimpMailerService.prototype.onCandidateSignSuccess = function (user) {
        var md5String = md5(user.email);
        var listId = config.get('TplSeed.mail.CANDIDATE_SIGN_IN_SUCCESS_LISTID');
        mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
            email_address: user.email,
            status: 'subscribed',
            merge_fields: {
                'FNAME': user.first_name,
                'LNAME': user.last_name
            }
        }).then(function (results) {
            _loggerService.logInfo(results);
        })
            .catch(function (err) {
            _loggerService.logError(err);
        });
    };
    MailChimpMailerService.prototype.onCandidatePofileSubmitted = function (user, isSubmitted, isEditingProfile) {
        if (!isEditingProfile && isSubmitted) {
            var md5String = md5(user.email);
            var listId = config.get('TplSeed.mail.CANDIDATE_PROFILE_SUBMIT_SUCCESS_LISTID');
            mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
                email_address: user.email,
                status: 'subscribed',
                merge_fields: {
                    'FNAME': user.first_name,
                    'LNAME': user.last_name
                }
            }).then(function (results) {
                _loggerService.logInfo(results);
            })
                .catch(function (err) {
                _loggerService.logError(err);
            });
        }
    };
    MailChimpMailerService.prototype.onCronJobCandidateProfileTriggered = function (profile_update_track, listId) {
        var _this = this;
        this.candidateRepository = new CandidateRepository();
        this.userRepository = new UserRepository();
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        this.candidateRepository.retrieveWithIncluded({
            'profile_update_tracking': profile_update_track,
            'lastUpdateAt': { $lt: new Date(), $gt: new Date(yesterday) }
        }, { 'userId': 1 }, function (err, res) {
            if (err) {
                _loggerService.logError(err);
            }
            else {
                for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                    var item = res_1[_i];
                    _this.userRepository.retrieveWithIncluded({ '_id': item.userId }, { 'email': 1 }, function (err, res) {
                        if (err) {
                            _loggerService.logError(err);
                        }
                        else {
                            _this.triggerMailChimpService(res[0].email, listId);
                        }
                    });
                }
            }
        });
    };
    MailChimpMailerService.prototype.triggerMailChimpService = function (email, listId) {
        var md5String = md5(email);
        mailchimpClient.put('/lists/' + listId + '/members/' + md5String, {
            email_address: email,
            status: 'subscribed',
        }).then(function (results) {
            _loggerService.logInfo(results);
        })
            .catch(function (err) {
            _loggerService.logError(err);
        });
    };
    return MailChimpMailerService;
}());
exports.MailChimpMailerService = MailChimpMailerService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGNoaW1wLW1haWxlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUZBQXNGO0FBQ3RGLHlFQUE0RTtBQUM1RSw4REFBaUU7QUFFakUsSUFBSSxjQUFjLEdBQWtCLElBQUksYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDbEYsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN0QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0IsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7QUFDM0MsSUFBSSxlQUFlLEdBQUcsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7QUFDdkYsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXpCO0lBQUE7SUEwRkEsQ0FBQztJQXRGQyx1REFBc0IsR0FBdEIsVUFBdUIsSUFBUztRQUM5QixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUN6RSxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLFNBQVMsRUFBRTtZQUNoRSxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDekIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQVk7WUFDNUIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUM7YUFDQyxLQUFLLENBQUMsVUFBVSxHQUFRO1lBQ3ZCLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsMkRBQTBCLEdBQTFCLFVBQTJCLElBQVMsRUFBRSxXQUFtQixFQUFDLGdCQUF5QjtRQUNqRixFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFDaEYsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLFdBQVcsR0FBRyxTQUFTLEVBQUU7Z0JBQ2hFLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDekIsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLFlBQVksRUFBRTtvQkFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDeEI7YUFDRixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBWTtnQkFDNUIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVsQyxDQUFDLENBQUM7aUJBQ0MsS0FBSyxDQUFDLFVBQVUsR0FBUTtnQkFDdkIsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUvQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUM7SUFFSCxDQUFDO0lBQ0QsbUVBQWtDLEdBQWxDLFVBQW1DLG9CQUEyQixFQUFDLE1BQWE7UUFBNUUsaUJBZ0NEO1FBOUJHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBRTNDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFHdkMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO1lBQzVDLHlCQUF5QixFQUFFLG9CQUFvQjtZQUMvQyxjQUFjLEVBQUMsRUFBQyxHQUFHLEVBQUMsSUFBSSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUM7U0FDeEQsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQU8sRUFBRSxHQUFPO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUvQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sR0FBRyxDQUFDLENBQWEsVUFBRyxFQUFILFdBQUcsRUFBSCxpQkFBRyxFQUFILElBQUc7b0JBQWYsSUFBSSxJQUFJLFlBQUE7b0JBQ1gsS0FBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLEVBQUUsVUFBQyxHQUFPLEVBQUUsR0FBTzt3QkFDNUYsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDUCxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMvQixDQUFDO3dCQUFBLElBQUksQ0FBQyxDQUFDOzRCQUNMLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNyRCxDQUFDO29CQUVILENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBR1AsQ0FBQztJQUVDLHdEQUF1QixHQUF2QixVQUF3QixLQUFZLEVBQUMsTUFBVTtRQUM3QyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDMUIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLFdBQVcsR0FBRyxTQUFTLEVBQUU7WUFDaEUsYUFBYSxFQUFFLEtBQUs7WUFDcEIsTUFBTSxFQUFFLFlBQVk7U0FDckIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQVk7WUFDNUIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUM7YUFDQyxLQUFLLENBQUMsVUFBVSxHQUFRO1lBQ3ZCLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQTFGQSxBQTBGQyxJQUFBO0FBMUZZLHdEQUFzQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL21haWxjaGltcC1tYWlsZXIuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW5kaWRhdGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IExvZ2dlclNlcnZpY2UgPSByZXF1aXJlKCcuLi9zaGFyZWQvbG9nZ2VyL0xvZ2dlclNlcnZpY2UnKTtcclxuXHJcbmxldCBfbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSA9IG5ldyBMb2dnZXJTZXJ2aWNlKCdNQUlMQ0hJTVBfTUFJTEVSX1NFUlZJQ0UnKTtcclxudmFyIENyb25Kb2IgPSByZXF1aXJlKCdjcm9uJykuQ3JvbkpvYjtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxubGV0IG1haWxjaGltcCA9IHJlcXVpcmUoJ21haWxjaGltcC1hcGktdjMnKVxyXG5sZXQgbWFpbGNoaW1wQ2xpZW50ID0gbmV3IG1haWxjaGltcChjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9DSElNUF9TRVJWSUNFX0tFWScpKTtcclxubGV0IG1kNSA9IHJlcXVpcmUoJ21kNScpO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1haWxDaGltcE1haWxlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgY2FuZGlkYXRlUmVwb3NpdG9yeTogQ2FuZGlkYXRlUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcclxuXHJcbiAgb25DYW5kaWRhdGVTaWduU3VjY2Vzcyh1c2VyOiBhbnkpIHtcclxuICAgIGxldCBtZDVTdHJpbmcgPSBtZDUodXNlci5lbWFpbClcclxuICAgIGxldCBsaXN0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQ0FORElEQVRFX1NJR05fSU5fU1VDQ0VTU19MSVNUSUQnKTtcclxuICAgIG1haWxjaGltcENsaWVudC5wdXQoJy9saXN0cy8nICsgbGlzdElkICsgJy9tZW1iZXJzLycgKyBtZDVTdHJpbmcsIHtcclxuICAgICAgZW1haWxfYWRkcmVzczogdXNlci5lbWFpbCxcclxuICAgICAgc3RhdHVzOiAnc3Vic2NyaWJlZCcsXHJcbiAgICAgIG1lcmdlX2ZpZWxkczoge1xyXG4gICAgICAgICdGTkFNRSc6IHVzZXIuZmlyc3RfbmFtZSxcclxuICAgICAgICAnTE5BTUUnOiB1c2VyLmxhc3RfbmFtZVxyXG4gICAgICB9XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzOiBhbnkpIHtcclxuICAgICAgX2xvZ2dlclNlcnZpY2UubG9nSW5mbyhyZXN1bHRzKTtcclxuICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICBfbG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnIpO1xyXG4gICAgICB9KVxyXG4gIH1cclxuXHJcbiAgb25DYW5kaWRhdGVQb2ZpbGVTdWJtaXR0ZWQodXNlcjogYW55LCBpc1N1Ym1pdHRlZDpib29sZWFuLGlzRWRpdGluZ1Byb2ZpbGU6IGJvb2xlYW4pIHtcclxuICAgIGlmICghaXNFZGl0aW5nUHJvZmlsZSAmJiBpc1N1Ym1pdHRlZCkge1xyXG4gICAgICBsZXQgbWQ1U3RyaW5nID0gbWQ1KHVzZXIuZW1haWwpXHJcbiAgICAgIGxldCBsaXN0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQ0FORElEQVRFX1BST0ZJTEVfU1VCTUlUX1NVQ0NFU1NfTElTVElEJyk7XHJcbiAgICAgIG1haWxjaGltcENsaWVudC5wdXQoJy9saXN0cy8nICsgbGlzdElkICsgJy9tZW1iZXJzLycgKyBtZDVTdHJpbmcsIHtcclxuICAgICAgICBlbWFpbF9hZGRyZXNzOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgIHN0YXR1czogJ3N1YnNjcmliZWQnLFxyXG4gICAgICAgIG1lcmdlX2ZpZWxkczoge1xyXG4gICAgICAgICAgJ0ZOQU1FJzogdXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgJ0xOQU1FJzogdXNlci5sYXN0X25hbWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHM6IGFueSkge1xyXG4gICAgICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0luZm8ocmVzdWx0cyk7XHJcblxyXG4gICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycik7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBvbkNyb25Kb2JDYW5kaWRhdGVQcm9maWxlVHJpZ2dlcmVkKHByb2ZpbGVfdXBkYXRlX3RyYWNrOm51bWJlcixsaXN0SWQ6c3RyaW5nKSB7XHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuXHJcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdmFyIHllc3RlcmRheSA9IG5ldyBEYXRlKHRvZGF5KTtcclxuICAgIHllc3RlcmRheS5zZXREYXRlKHRvZGF5LmdldERhdGUoKSAtIDEpO1xyXG5cclxuXHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVXaXRoSW5jbHVkZWQoe1xyXG4gICAgICAncHJvZmlsZV91cGRhdGVfdHJhY2tpbmcnOiBwcm9maWxlX3VwZGF0ZV90cmFjayxcclxuICAgICAgJ2xhc3RVcGRhdGVBdCc6eyRsdDpuZXcgRGF0ZSgpLCRndDpuZXcgRGF0ZSh5ZXN0ZXJkYXkpfVxyXG4gICAgfSwgeyd1c2VySWQnOiAxfSwgKGVycjphbnksIHJlczphbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycik7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcmVzKSB7XHJcbiAgICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlV2l0aEluY2x1ZGVkKHsnX2lkJzogaXRlbS51c2VySWR9LCB7J2VtYWlsJzogMX0sIChlcnI6YW55LCByZXM6YW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycik7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJNYWlsQ2hpbXBTZXJ2aWNlKHJlc1swXS5lbWFpbCwgbGlzdElkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxufVxyXG5cclxuICB0cmlnZ2VyTWFpbENoaW1wU2VydmljZShlbWFpbDpzdHJpbmcsbGlzdElkOmFueSkge1xyXG4gICAgbGV0IG1kNVN0cmluZyA9IG1kNShlbWFpbClcclxuICAgIG1haWxjaGltcENsaWVudC5wdXQoJy9saXN0cy8nICsgbGlzdElkICsgJy9tZW1iZXJzLycgKyBtZDVTdHJpbmcsIHtcclxuICAgICAgZW1haWxfYWRkcmVzczogZW1haWwsXHJcbiAgICAgIHN0YXR1czogJ3N1YnNjcmliZWQnLFxyXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0czogYW55KSB7XHJcbiAgICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0luZm8ocmVzdWx0cyk7XHJcbiAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgX2xvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyKTtcclxuICAgICAgfSlcclxuICB9XHJcbn1cclxuIl19
