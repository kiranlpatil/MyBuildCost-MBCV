"use strict";
var SubscriptionService = require("../services/SubscriptionService");
var Response = require("../interceptor/response/Response");
var CostControllException = require("../exception/CostControllException");
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Subscription Controller');
var SubscriptionController = (function () {
    function SubscriptionController() {
        this._subscriptionService = new SubscriptionService();
    }
    SubscriptionController.prototype.addSubscriptionPackage = function (req, res, next) {
        try {
            logger.info('Subscription Controller, addSubscriptionPackage has been hit');
            var subscriptionPackage = req.body.package;
            var user = req.user;
            var subscriptionService = new SubscriptionService();
            subscriptionService.addSubscriptionPackage(subscriptionPackage, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Create Subscription  success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    SubscriptionController.prototype.getBaseSubscriptionPackageList = function (req, res, next) {
        try {
            logger.info('Subscription Controller, getSubscriptionPackageList has been hit');
            var subscriptionService = new SubscriptionService();
            subscriptionService.getBaseSubscriptionPackageList(function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get base Subscription package list success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    SubscriptionController.prototype.getSubscriptionPackageByName = function (req, res, next) {
        try {
            logger.info('Subscription  Controller, getSubscriptionPackageByName has been hit');
            var packageName = void 0;
            var packageType = void 0;
            if (req.body.basePackageName !== undefined) {
                packageName = req.body.basePackageName;
                packageType = 'BasePackage';
            }
            else {
                packageName = req.body.addOnPackageName;
                packageType = 'AddOnPackage';
            }
            var subscriptionService = new SubscriptionService();
            subscriptionService.getSubscriptionPackageByName(packageName, packageType, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Subscription success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    return SubscriptionController;
}());
module.exports = SubscriptionController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvU3Vic2NyaXB0aW9uQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBQ3hFLDJEQUE4RDtBQUU5RCwwRUFBNkU7QUFFN0UsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQ7SUFHRTtRQUNFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELHVEQUFzQixHQUF0QixVQUF1QixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7WUFDNUUsSUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksbUJBQW1CLEdBQXdCLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN6RSxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBRSxtQkFBbUIsRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM1RSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxD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bnRyb2xsZXJzL1N1YnNjcmlwdGlvbkNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3Vic2NyaXB0aW9uU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1N1YnNjcmlwdGlvblNlcnZpY2UnKTtcclxuaW1wb3J0IFJlc3BvbnNlID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UnKTtcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5cclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignU3Vic2NyaXB0aW9uIENvbnRyb2xsZXInKTtcclxuY2xhc3MgU3Vic2NyaXB0aW9uQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSAgX3N1YnNjcmlwdGlvblNlcnZpY2UgOiBTdWJzY3JpcHRpb25TZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgYWRkU3Vic2NyaXB0aW9uUGFja2FnZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gQ29udHJvbGxlciwgYWRkU3Vic2NyaXB0aW9uUGFja2FnZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXEuYm9keS5wYWNrYWdlO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uU2VydmljZTogU3Vic2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICAgIHN1YnNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZSggc3Vic2NyaXB0aW9uUGFja2FnZSwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0NyZWF0ZSBTdWJzY3JpcHRpb24gIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZVN1YnNjcmlwdGlvblBhY2thZ2VMaXN0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1N1YnNjcmlwdGlvbiBDb250cm9sbGVyLCBnZXRTdWJzY3JpcHRpb25QYWNrYWdlTGlzdCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblNlcnZpY2U6IFN1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICBzdWJzY3JpcHRpb25TZXJ2aWNlLmdldEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlTGlzdCggKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgYmFzZSBTdWJzY3JpcHRpb24gcGFja2FnZSBsaXN0IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gIENvbnRyb2xsZXIsIGdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBwYWNrYWdlTmFtZTogYW55O1xyXG4gICAgICBsZXQgcGFja2FnZVR5cGUgOiBhbnk7XHJcbiAgICAgIGlmKHJlcS5ib2R5LmJhc2VQYWNrYWdlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGFja2FnZU5hbWUgPSByZXEuYm9keS5iYXNlUGFja2FnZU5hbWU7XHJcbiAgICAgICAgcGFja2FnZVR5cGUgPSAnQmFzZVBhY2thZ2UnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhY2thZ2VOYW1lID0gcmVxLmJvZHkuYWRkT25QYWNrYWdlTmFtZTtcclxuICAgICAgICBwYWNrYWdlVHlwZSA9ICdBZGRPblBhY2thZ2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb25TZXJ2aWNlOiBTdWJzY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgc3Vic2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCBwYWNrYWdlTmFtZSwgcGFja2FnZVR5cGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFN1YnNjcmlwdGlvbiBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFN1YnNjcmlwdGlvbkNvbnRyb2xsZXI7XHJcbiJdfQ==
