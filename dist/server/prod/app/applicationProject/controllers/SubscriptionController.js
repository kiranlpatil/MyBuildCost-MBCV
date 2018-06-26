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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvU3Vic2NyaXB0aW9uQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBQ3hFLDJEQUE4RDtBQUU5RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsMEVBQTZFO0FBRzdFO0lBR0U7UUFDRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRCx1REFBc0IsR0FBdEIsVUFBdUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDM0UsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1lBQzVFLElBQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDM0MsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLG1CQUFtQixHQUF3QixJQUFJLG1CQUFtQixFQUFFLENBQUM7WUFDekUsbUJBQW1CLENBQUMsc0JBQXNCLENBQUUsbUJBQW1CLEVBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDNUUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFB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QUFDO1lBQ3RHLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsK0NBQWMsR0FBZCxVQUFlLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ25FLElBQUksQ0FBQztZQUNILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUUsaUNBQWlDLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFSCw2QkFBQztBQUFELENBM0dBLEFBMkdDLElBQUE7QUFFRCxpQkFBUyxzQkFBc0IsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2NvbnRyb2xsZXJzL1N1YnNjcmlwdGlvbkNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3Vic2NyaXB0aW9uU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1N1YnNjcmlwdGlvblNlcnZpY2UnKTtcclxuaW1wb3J0IFJlc3BvbnNlID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UnKTtcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbnZhciBoYXNoS2V5ID0gcmVxdWlyZSgnanMtc2hhNTEyJyk7XHJcbmxldCBwYXl1bW9uZXkgPSByZXF1aXJlKCdwYXl1bW9uZXktbm9kZScpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignU3Vic2NyaXB0aW9uIENvbnRyb2xsZXInKTtcclxuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcclxuaW1wb3J0IHsgUGF5VU1vbmV5TW9kZWwgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb2RlbC9QYXlVTW9uZXlNb2RlbCc7XHJcblxyXG5jbGFzcyBTdWJzY3JpcHRpb25Db250cm9sbGVyIHtcclxuICBwcml2YXRlICBfc3Vic2NyaXB0aW9uU2VydmljZSA6IFN1YnNjcmlwdGlvblNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBhZGRTdWJzY3JpcHRpb25QYWNrYWdlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1N1YnNjcmlwdGlvbiBDb250cm9sbGVyLCBhZGRTdWJzY3JpcHRpb25QYWNrYWdlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uUGFja2FnZSA9IHJlcS5ib2R5LnBhY2thZ2U7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBzdWJzY3JpcHRpb25TZXJ2aWNlOiBTdWJzY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgc3Vic2NyaXB0aW9uU2VydmljZS5hZGRTdWJzY3JpcHRpb25QYWNrYWdlKCBzdWJzY3JpcHRpb25QYWNrYWdlLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQ3JlYXRlIFN1YnNjcmlwdGlvbiAgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCYXNlU3Vic2NyaXB0aW9uUGFja2FnZUxpc3QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnU3Vic2NyaXB0aW9uIENvbnRyb2xsZXIsIGdldFN1YnNjcmlwdGlvblBhY2thZ2VMaXN0IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uU2VydmljZTogU3Vic2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICAgIHN1YnNjcmlwdGlvblNlcnZpY2UuZ2V0QmFzZVN1YnNjcmlwdGlvblBhY2thZ2VMaXN0KCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBiYXNlIFN1YnNjcmlwdGlvbiBwYWNrYWdlIGxpc3Qgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1N1YnNjcmlwdGlvbiAgQ29udHJvbGxlciwgZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHBhY2thZ2VOYW1lOiBhbnk7XHJcbiAgICAgIGxldCBwYWNrYWdlVHlwZSA6IGFueTtcclxuICAgICAgaWYocmVxLmJvZHkuYmFzZVBhY2thZ2VOYW1lICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwYWNrYWdlTmFtZSA9IHJlcS5ib2R5LmJhc2VQYWNrYWdlTmFtZTtcclxuICAgICAgICBwYWNrYWdlVHlwZSA9ICdCYXNlUGFja2FnZSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGFja2FnZU5hbWUgPSByZXEuYm9keS5hZGRPblBhY2thZ2VOYW1lO1xyXG4gICAgICAgIHBhY2thZ2VUeXBlID0gJ0FkZE9uUGFja2FnZSc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblNlcnZpY2U6IFN1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICBzdWJzY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoIHBhY2thZ2VOYW1lLCBwYWNrYWdlVHlwZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgU3Vic2NyaXB0aW9uIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVQYXlVTW9uZXlUcmFuc2FjY3Rpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcGF5bWVudEJvZHkgPSByZXEuYm9keTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblNlcnZpY2U6IFN1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICBzdWJzY3JpcHRpb25TZXJ2aWNlLm1ha2VQYXlVTW9uZXlQYXltZW50KHBheW1lbnRCb2R5LChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFN1YnNjcmlwdGlvbiBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1Y2Nlc3NQYXltZW50KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc29sZS5sb2coJ3BheW1lbnQgc3VjY2VzcyA6ICcrIEpTT04uc3RyaW5naWZ5KHJlcS5ib2R5KSk7XHJcbiAgICAgIGxldCBwa2dOYW1lID0gcmVxLmJvZHkucHJvZHVjdGluZm87XHJcbiAgICAgIGxldCByZWRpcmVjdFVybCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLmJyb3dzZXIuSVAnKSArJ3BhY2thZ2UtZGV0YWlscy9wYXltZW50LycrcGtnTmFtZSsnL3N1Y2Nlc3MnO1xyXG4gICAgICByZXMucmVkaXJlY3QocmVkaXJlY3RVcmwpO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmFpbHVyZVBheW1lbnQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICBjb25zb2xlLmxvZygncGF5bWVudCBmYWlsZWQgOiAnKyBKU09OLnN0cmluZ2lmeShib2R5KSk7XHJcbiAgICAgIHJlcy5yZWRpcmVjdChjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5icm93c2VyLklQJykgKydwYWNrYWdlLWRldGFpbHMvcGF5bWVudC9mYWlsdXJlJyk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gU3Vic2NyaXB0aW9uQ29udHJvbGxlcjtcclxuIl19
