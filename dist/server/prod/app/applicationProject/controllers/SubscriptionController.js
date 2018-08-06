"use strict";
var SubscriptionService = require("../services/SubscriptionService");
var Response = require("../interceptor/response/Response");
var config = require('config');
var hashKey = require('js-sha512');
var payumoney = require('payumoney-node');
var log4js = require('log4js');
var logger = log4js.getLogger('Subscription Controller');
var CostControllException = require("../exception/CostControllException");
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
    SubscriptionController.prototype.generatePayUMoneyTransacction = function (req, res, next) {
        try {
            var paymentBody = req.body;
            var subscriptionService = new SubscriptionService();
            subscriptionService.makePayUMoneyPayment(paymentBody, function (error, result) {
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
    SubscriptionController.prototype.successPayment = function (req, res, next) {
        try {
            console.log('payment success : ' + JSON.stringify(req.body));
            var pkgName = req.body.productinfo;
            var redirectUrl = config.get('application.browser.IP') + 'package-details/payment/' + pkgName + '/success';
            res.redirect(redirectUrl);
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    SubscriptionController.prototype.successPayuMoney = function (req, res, next) {
        try {
            console.log('payment success : ' + JSON.stringify(req.body));
            var pkgName = req.body.productinfo;
            var redirectUrl = 'http://5d477bbb.ngrok.io/about';
            res.render(redirectUrl);
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    SubscriptionController.prototype.failurePayment = function (req, res, next) {
        try {
            var body = req.body;
            console.log('payment failed : ' + JSON.stringify(body));
            res.redirect(config.get('application.browser.IP') + 'package-details/payment/failure');
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    return SubscriptionController;
}());
module.exports = SubscriptionController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvU3Vic2NyaXB0aW9uQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBQ3hFLDJEQUE4RDtBQUU5RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsMEVBQTZFO0FBRzdFO0lBR0U7UUFDRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRCx1REFBc0IsR0FBdEIsVUFBdUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDM0UsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1lBQzVFLElBQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0MsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLG1CQUFtQixHQUF3QixJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDekUsbUJBQW1CLENBQUMsc0JBQXNCLENBQUUsbUJBQW1CLEVBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDNUUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFB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Q0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUgsNkJBQUM7QUFBRCxDQXRIQSxBQXNIQyxJQUFBO0FBRUQsaUJBQVMsc0JBQXNCLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9jb250cm9sbGVycy9TdWJzY3JpcHRpb25Db250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN1YnNjcmlwdGlvblNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9TdWJzY3JpcHRpb25TZXJ2aWNlJyk7XHJcbmltcG9ydCBSZXNwb25zZSA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3Jlc3BvbnNlL1Jlc3BvbnNlJyk7XHJcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgaGFzaEtleSA9IHJlcXVpcmUoJ2pzLXNoYTUxMicpO1xyXG5sZXQgcGF5dW1vbmV5ID0gcmVxdWlyZSgncGF5dW1vbmV5LW5vZGUnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1N1YnNjcmlwdGlvbiBDb250cm9sbGVyJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCB7IFBheVVNb25leU1vZGVsIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvbW9kZWwvUGF5VU1vbmV5TW9kZWwnO1xyXG5cclxuY2xhc3MgU3Vic2NyaXB0aW9uQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSAgX3N1YnNjcmlwdGlvblNlcnZpY2UgOiBTdWJzY3JpcHRpb25TZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgYWRkU3Vic2NyaXB0aW9uUGFja2FnZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gQ29udHJvbGxlciwgYWRkU3Vic2NyaXB0aW9uUGFja2FnZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXEuYm9keS5wYWNrYWdlO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uU2VydmljZTogU3Vic2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICAgIHN1YnNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZSggc3Vic2NyaXB0aW9uUGFja2FnZSwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0NyZWF0ZSBTdWJzY3JpcHRpb24gIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFzZVN1YnNjcmlwdGlvblBhY2thZ2VMaXN0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1N1YnNjcmlwdGlvbiBDb250cm9sbGVyLCBnZXRTdWJzY3JpcHRpb25QYWNrYWdlTGlzdCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblNlcnZpY2U6IFN1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICBzdWJzY3JpcHRpb25TZXJ2aWNlLmdldEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlTGlzdCggKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgYmFzZSBTdWJzY3JpcHRpb24gcGFja2FnZSBsaXN0IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gIENvbnRyb2xsZXIsIGdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBwYWNrYWdlTmFtZTogYW55O1xyXG4gICAgICBsZXQgcGFja2FnZVR5cGUgOiBhbnk7XHJcbiAgICAgIGlmKHJlcS5ib2R5LmJhc2VQYWNrYWdlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcGFja2FnZU5hbWUgPSByZXEuYm9keS5iYXNlUGFja2FnZU5hbWU7XHJcbiAgICAgICAgcGFja2FnZVR5cGUgPSAnQmFzZVBhY2thZ2UnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBhY2thZ2VOYW1lID0gcmVxLmJvZHkuYWRkT25QYWNrYWdlTmFtZTtcclxuICAgICAgICBwYWNrYWdlVHlwZSA9ICdBZGRPblBhY2thZ2UnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb25TZXJ2aWNlOiBTdWJzY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgc3Vic2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCBwYWNrYWdlTmFtZSwgcGFja2FnZVR5cGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFN1YnNjcmlwdGlvbiBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdlbmVyYXRlUGF5VU1vbmV5VHJhbnNhY2N0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHBheW1lbnRCb2R5ID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb25TZXJ2aWNlOiBTdWJzY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgc3Vic2NyaXB0aW9uU2VydmljZS5tYWtlUGF5VU1vbmV5UGF5bWVudChwYXltZW50Qm9keSwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBTdWJzY3JpcHRpb24gc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWNjZXNzUGF5bWVudChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXltZW50IHN1Y2Nlc3MgOiAnKyBKU09OLnN0cmluZ2lmeShyZXEuYm9keSkpO1xyXG4gICAgICBsZXQgcGtnTmFtZSA9IHJlcS5ib2R5LnByb2R1Y3RpbmZvO1xyXG4gICAgICBsZXQgcmVkaXJlY3RVcmwgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5icm93c2VyLklQJykgKydwYWNrYWdlLWRldGFpbHMvcGF5bWVudC8nK3BrZ05hbWUrJy9zdWNjZXNzJztcclxuICAgICAgcmVzLnJlZGlyZWN0KHJlZGlyZWN0VXJsKTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1Y2Nlc3NQYXl1TW9uZXkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zb2xlLmxvZygncGF5bWVudCBzdWNjZXNzIDogJysgSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpKTtcclxuICAgICAgbGV0IHBrZ05hbWUgPSByZXEuYm9keS5wcm9kdWN0aW5mbztcclxuICAgICAgbGV0IHJlZGlyZWN0VXJsID0gJ2h0dHA6Ly81ZDQ3N2JiYi5uZ3Jvay5pby9hYm91dCc7XHJcbiAgICAgIHJlcy5yZW5kZXIocmVkaXJlY3RVcmwpO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmFpbHVyZVBheW1lbnQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICBjb25zb2xlLmxvZygncGF5bWVudCBmYWlsZWQgOiAnKyBKU09OLnN0cmluZ2lmeShib2R5KSk7XHJcbiAgICAgIHJlcy5yZWRpcmVjdChjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5icm93c2VyLklQJykgKydwYWNrYWdlLWRldGFpbHMvcGF5bWVudC9mYWlsdXJlJyk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gU3Vic2NyaXB0aW9uQ29udHJvbGxlcjtcclxuIl19
