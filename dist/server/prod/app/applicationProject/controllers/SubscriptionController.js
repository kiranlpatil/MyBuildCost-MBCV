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
    SubscriptionController.prototype.getSubscriptionPackageByName = function (req, res, next) {
        try {
            logger.info('Subscription  Controller, getSubscriptionPackageByName has been hit');
            var basePackageName = req.body.basePackageName;
            var user = req.user;
            var subscriptionService = new SubscriptionService();
            subscriptionService.getSubscriptionPackageByName(basePackageName, function (error, result) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvU3Vic2NyaXB0aW9uQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUVBQXdFO0FBQ3hFLDJEQUE4RDtBQUU5RCwwRUFBNkU7QUFFN0UsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQ7SUFHRTtRQUNFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELHVEQUFzQixHQUF0QixVQUF1QixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7WUFDNUUsSUFBSSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksbUJBQW1CLEdBQXdCLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN6RSxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBRSxtQkFBbUIsRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM1RSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCw2REFBNEIsR0FBNUIsVUFBNkIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDakYsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1lBQ25GLElBQUksZUFBZSxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ3ZELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxtQkFBbUIsR0FBd0IsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1lBQ3pFLG1CQUFtQixDQUFDLDRCQUE0QixDQUFFLGVBQWUsRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM5RSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFDSCw2QkFBQztBQUFELENBNUNBLEFBNENDLElBQUE7QUFFRCxpQkFBUyxzQkFBc0IsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2NvbnRyb2xsZXJzL1N1YnNjcmlwdGlvbkNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3Vic2NyaXB0aW9uU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1N1YnNjcmlwdGlvblNlcnZpY2UnKTtcclxuaW1wb3J0IFJlc3BvbnNlID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UnKTtcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5cclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignU3Vic2NyaXB0aW9uIENvbnRyb2xsZXInKTtcclxuY2xhc3MgU3Vic2NyaXB0aW9uQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSAgX3N1YnNjcmlwdGlvblNlcnZpY2UgOiBTdWJzY3JpcHRpb25TZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgYWRkU3Vic2NyaXB0aW9uUGFja2FnZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gQ29udHJvbGxlciwgYWRkU3Vic2NyaXB0aW9uUGFja2FnZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXEuYm9keS5wYWNrYWdlO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uU2VydmljZTogU3Vic2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICAgIHN1YnNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZSggc3Vic2NyaXB0aW9uUGFja2FnZSwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0NyZWF0ZSBTdWJzY3JpcHRpb24gIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdTdWJzY3JpcHRpb24gIENvbnRyb2xsZXIsIGdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBiYXNlUGFja2FnZU5hbWU6IHN0cmluZyA9IHJlcS5ib2R5LmJhc2VQYWNrYWdlTmFtZTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHN1YnNjcmlwdGlvblNlcnZpY2U6IFN1YnNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICBzdWJzY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoIGJhc2VQYWNrYWdlTmFtZSwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBTdWJzY3JpcHRpb24gc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgPSBTdWJzY3JpcHRpb25Db250cm9sbGVyO1xyXG4iXX0=
