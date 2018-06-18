"use strict";
var SubscriptionRepository = require("../dataaccess/repository/SubscriptionRepository");
var messages = require("../../applicationProject/shared/messages");
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('subscription Service');
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
                logger.info('subscription service, create has been hit');
                var projectId = res._id;
                callback(null, res);
            }
        });
    };
    SubscriptionService.prototype.getBaseSubscriptionPackageList = function (callback) {
        var query = [
            { $unwind: '$basePackage' },
            { $project: { 'basePackage': 1, _id: 0 } }
        ];
        this.subscriptionRepository.aggregate(query, function (error, subscriptionPackageList) {
            if (error) {
                callback(error, null);
            }
            else {
                if (subscriptionPackageList.length > 0) {
                    callback(error, subscriptionPackageList);
                }
                else {
                    var error_1 = new Error();
                    error_1.message = messages.MSG_ERROR_SUBSCRIPTION_PACKAGES_DETAILS_ARE_NOT_DEFINED;
                    callback(error_1, null);
                }
            }
        });
    };
    SubscriptionService.prototype.getSubscriptionPackageByName = function (packageName, packageType, callback) {
        var query;
        if (packageType === 'BasePackage') {
            query = { 'basePackage.name': packageName };
        }
        else {
            query = { 'addOnPackage.name': packageName };
        }
        this.subscriptionRepository.retrieve(query, callback);
    };
    return SubscriptionService;
}());
module.exports = SubscriptionService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0ZBQTJGO0FBRTNGLG1FQUF1RTtBQUd2RSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwRDtJQUdFO1FBRlEsMkJBQXNCLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO1FBRzVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUNELG9EQUFzQixHQUF0QixVQUF1QixtQkFBd0IsRUFBRyxRQUEyQztRQUMzRixJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDL0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDREQUE4QixHQUE5QixVQUErQixRQUF1RjtRQUNwSCxJQUFJLEtBQUssR0FBRztZQUNWLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBQztZQUN6QixFQUFDLFFBQVEsRUFBRSxFQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBQyxFQUFDO1NBQ3RDLENBQUM7UUFFRixJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQUssRUFBRSx1QkFBdUI7WUFDMUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsUUFBUSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUFBLElBQUksQ0FBQyxDQUFDO29CQUNMLElBQUksT0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ3hCLE9BQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLHVEQUF1RCxDQUFDO29CQUNqRixRQUFRLENBQUMsT0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDBEQUE0QixHQUE1QixVQUE2QixXQUFvQixFQUFFLFdBQWtCLEVBQUUsUUFBMEM7UUFDL0csSUFBSSxLQUFXLENBQUM7UUFDaEIsRUFBRSxDQUFBLENBQUMsV0FBVyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDakMsS0FBSyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSyxHQUFHLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDSCwwQkFBQztBQUFELENBaERBLEFBZ0RDLElBQUE7QUFFRCxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1N1YnNjcmlwdGlvblNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3Vic2NyaXB0aW9uUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9TdWJzY3JpcHRpb25SZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBCYXNlU3Vic2NyaXB0aW9uUGFja2FnZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UnKTtcclxuaW1wb3J0IG1lc3NhZ2VzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcclxuXHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ3N1YnNjcmlwdGlvbiBTZXJ2aWNlJyk7XHJcbmNsYXNzIFN1YnNjcmlwdGlvblNlcnZpY2Uge1xyXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uUmVwb3NpdG9yeSA9IG5ldyBTdWJzY3JpcHRpb25SZXBvc2l0b3J5KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zdWJzY3JpcHRpb25SZXBvc2l0b3J5ID0gbmV3IFN1YnNjcmlwdGlvblJlcG9zaXRvcnkoKTtcclxuICB9XHJcbiAgYWRkU3Vic2NyaXB0aW9uUGFja2FnZShzdWJzY3JpcHRpb25QYWNrYWdlOiBhbnksICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvblJlcG9zaXRvcnkuY3JlYXRlKHN1YnNjcmlwdGlvblBhY2thZ2UsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnc3Vic2NyaXB0aW9uIHNlcnZpY2UsIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICBsZXQgcHJvamVjdElkID0gcmVzLl9pZDtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlTGlzdChjYWxsYmFjazogKGVycm9yOiBhbnksIHN1YnNjcmlwdGlvblBhY2thZ2VMaXN0OiBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyR1bndpbmQ6ICckYmFzZVBhY2thZ2UnfSxcclxuICAgICAgeyRwcm9qZWN0OiB7J2Jhc2VQYWNrYWdlJzogMSwgX2lkOjB9fVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvblJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHN1YnNjcmlwdGlvblBhY2thZ2VMaXN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc3Vic2NyaXB0aW9uUGFja2FnZUxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHN1YnNjcmlwdGlvblBhY2thZ2VMaXN0KTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlcy5NU0dfRVJST1JfU1VCU0NSSVBUSU9OX1BBQ0tBR0VTX0RFVEFJTFNfQVJFX05PVF9ERUZJTkVEO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKHBhY2thZ2VOYW1lIDogc3RyaW5nLCBwYWNrYWdlVHlwZTpzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5IDogYW55O1xyXG4gICAgaWYocGFja2FnZVR5cGUgPT09ICdCYXNlUGFja2FnZScpIHtcclxuICAgICAgcXVlcnkgPSB7ICdiYXNlUGFja2FnZS5uYW1lJzogcGFja2FnZU5hbWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcXVlcnkgPSB7ICdhZGRPblBhY2thZ2UubmFtZSc6IHBhY2thZ2VOYW1lfTtcclxuICAgIH1cclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0ID0gU3Vic2NyaXB0aW9uU2VydmljZTtcclxuIl19
