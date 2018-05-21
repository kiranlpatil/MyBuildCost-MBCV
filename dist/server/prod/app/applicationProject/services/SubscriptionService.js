"use strict";
var SubscriptionRepository = require("../dataaccess/repository/SubscriptionRepository");
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Subscription Service');
var SubscriptionService = (function () {
    function SubscriptionService() {
        this.subscriptionRepository = new SubscriptionRepository();
        this.subscriptionRepository = new SubscriptionRepository();
    }
    SubscriptionService.prototype.addSubscriptionPackage = function (subscriptionPackage, callback) {
        this.subscriptionRepository.create(subscriptionPackage, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                logger.info('Subscription service, create has been hit');
                var projectId = res._id;
                callback(null, res);
            }
        });
    };
    SubscriptionService.prototype.getSubscriptionPackageByName = function (basePackageName, callback) {
        var query = { 'basePackage.name': basePackageName };
        this.subscriptionRepository.retrieve(query, callback);
    };
    return SubscriptionService;
}());
module.exports = SubscriptionService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0ZBQTJGO0FBRTNGLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BEO0lBR0U7UUFGUSwyQkFBc0IsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7UUFHNUQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0Qsb0RBQXNCLEdBQXRCLFVBQXVCLG1CQUFtQixFQUFHLFFBQTJDO1FBQ3RGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztnQkFDekQsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDeEIsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMERBQTRCLEdBQTVCLFVBQTZCLGVBQXdCLEVBQUUsUUFBMEM7UUFDL0YsSUFBSSxLQUFLLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQXRCQSxBQXNCQyxJQUFBO0FBRUQsaUJBQVMsbUJBQW1CLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9zZXJ2aWNlcy9TdWJzY3JpcHRpb25TZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN1YnNjcmlwdGlvblJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1N1YnNjcmlwdGlvblJlcG9zaXRvcnlcIik7XHJcblxyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbnZhciBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxudmFyIGxvZ2dlcj1sb2c0anMuZ2V0TG9nZ2VyKCdTdWJzY3JpcHRpb24gU2VydmljZScpO1xyXG5jbGFzcyBTdWJzY3JpcHRpb25TZXJ2aWNlIHtcclxuICBwcml2YXRlIHN1YnNjcmlwdGlvblJlcG9zaXRvcnkgPSBuZXcgU3Vic2NyaXB0aW9uUmVwb3NpdG9yeSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uUmVwb3NpdG9yeSA9IG5ldyBTdWJzY3JpcHRpb25SZXBvc2l0b3J5KCk7XHJcbiAgfVxyXG4gIGFkZFN1YnNjcmlwdGlvblBhY2thZ2Uoc3Vic2NyaXB0aW9uUGFja2FnZSwgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uUmVwb3NpdG9yeS5jcmVhdGUoc3Vic2NyaXB0aW9uUGFja2FnZSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gc2VydmljZSwgY3JlYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0SWQgPSByZXMuX2lkO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZShiYXNlUGFja2FnZU5hbWUgOiBzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geyAnYmFzZVBhY2thZ2UubmFtZSc6IGJhc2VQYWNrYWdlTmFtZX07XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvblJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFN1YnNjcmlwdGlvblNlcnZpY2U7XHJcbiJdfQ==
