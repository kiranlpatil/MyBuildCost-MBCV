"use strict";
var config = require('config');
var path = require('path');
var MailAttachments = (function () {
    function MailAttachments() {
    }
    MailAttachments.AttachmentArray = [
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/logo/application-logo.png',
            cid: 'unique@application-logo'
        }
    ];
    MailAttachments.ForgetPasswordAttachmentArray = [
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/logo/application-logo.png',
            cid: 'unique@application-logo'
        },
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/banner/password-reset.png',
            cid: 'unique@password-reset'
        },
    ];
    MailAttachments.TrialExpiringAttachmentArray = [
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/logo/application-logo.png',
            cid: 'unique@application-logo'
        },
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/banner/trial-expiring.png',
            cid: 'unique@trial-expiring'
        },
    ];
    MailAttachments.WelcomeAboardAttachmentArray = [
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/logo/application-logo.png',
            cid: 'unique@application-logo'
        },
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/banner/welcome-aboard.png',
            cid: 'unique@welcome-aboard'
        }
    ];
    MailAttachments.FirstTimeSubscribedAttachmentArray = [
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/logo/application-logo.png',
            cid: 'unique@application-logo'
        },
        {
            path: path.resolve() + config.get('application.publicPath') + 'images/banner/successfully-subscribed.png',
            cid: 'unique@first-time-subscribed'
        }
    ];
    return MailAttachments;
}());
module.exports = MailAttachments;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL3NoYXJlZGFycmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCO0lBQUE7SUErQ0EsQ0FBQztJQTlDZSwrQkFBZSxHQUFlO1FBQzFDO1lBQ0UsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUMsa0NBQWtDO1lBQzlGLEdBQUcsRUFBRSx5QkFBeUI7U0FDL0I7S0FDRixDQUFDO0lBQ1ksNkNBQTZCLEdBQWU7UUFDeEQ7WUFDRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDOUYsR0FBRyxFQUFFLHlCQUF5QjtTQUMvQjtRQUNEO1lBQ0UsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUMsa0NBQWtDO1lBQy9GLEdBQUcsRUFBRSx1QkFBdUI7U0FDN0I7S0FDRixDQUFDO0lBQ1ksNENBQTRCLEdBQWU7UUFDdkQ7WUFDRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDOUYsR0FBRyxFQUFFLHlCQUF5QjtTQUMvQjtRQUNEO1lBQ0UsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUMsa0NBQWtDO1lBQy9GLEdBQUcsRUFBRSx1QkFBdUI7U0FDN0I7S0FDRixDQUFDO0lBQ1ksNENBQTRCLEdBQVk7UUFDcEQ7WUFDRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDOUYsR0FBRyxFQUFFLHlCQUF5QjtTQUMvQjtRQUNEO1lBQ0UsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUMsa0NBQWtDO1lBQy9GLEdBQUcsRUFBRSx1QkFBdUI7U0FDN0I7S0FDRixDQUFDO0lBQ1ksa0RBQWtDLEdBQVk7UUFDMUQ7WUFDRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDOUYsR0FBRyxFQUFFLHlCQUF5QjtTQUMvQjtRQUNEO1lBQ0UsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUMsMkNBQTJDO1lBQ3hHLEdBQUcsRUFBRSw4QkFBOEI7U0FDcEM7S0FDRixDQUFDO0lBQ0osc0JBQUM7Q0EvQ0QsQUErQ0MsSUFBQTtBQUNELGlCQUFPLGVBQWUsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NoYXJlZC9zaGFyZWRhcnJheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbmNsYXNzIE1haWxBdHRhY2htZW50cyB7XHJcbiAgcHVibGljIHN0YXRpYyBBdHRhY2htZW50QXJyYXk6IEFycmF5PGFueT4gPSBbXHJcbiAgICB7XHJcbiAgICAgIHBhdGg6IHBhdGgucmVzb2x2ZSgpICsgY29uZmlnLmdldCgnYXBwbGljYXRpb24ucHVibGljUGF0aCcpKydpbWFnZXMvbG9nby9hcHBsaWNhdGlvbi1sb2dvLnBuZycsXHJcbiAgICAgIGNpZDogJ3VuaXF1ZUBhcHBsaWNhdGlvbi1sb2dvJ1xyXG4gICAgfVxyXG4gIF07XHJcbiAgcHVibGljIHN0YXRpYyBGb3JnZXRQYXNzd29yZEF0dGFjaG1lbnRBcnJheTogQXJyYXk8YW55PiA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9sb2dvL2FwcGxpY2F0aW9uLWxvZ28ucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQGFwcGxpY2F0aW9uLWxvZ28nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAgcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9iYW5uZXIvcGFzc3dvcmQtcmVzZXQucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQHBhc3N3b3JkLXJlc2V0J1xyXG4gICAgfSxcclxuICBdO1xyXG4gIHB1YmxpYyBzdGF0aWMgVHJpYWxFeHBpcmluZ0F0dGFjaG1lbnRBcnJheTogQXJyYXk8YW55PiA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9sb2dvL2FwcGxpY2F0aW9uLWxvZ28ucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQGFwcGxpY2F0aW9uLWxvZ28nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAgcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9iYW5uZXIvdHJpYWwtZXhwaXJpbmcucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQHRyaWFsLWV4cGlyaW5nJ1xyXG4gICAgfSxcclxuICBdO1xyXG4gIHB1YmxpYyBzdGF0aWMgV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheTpBcnJheTxhbnk+PVtcclxuICAgIHtcclxuICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9sb2dvL2FwcGxpY2F0aW9uLWxvZ28ucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQGFwcGxpY2F0aW9uLWxvZ28nXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAgcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9iYW5uZXIvd2VsY29tZS1hYm9hcmQucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQHdlbGNvbWUtYWJvYXJkJ1xyXG4gICAgfVxyXG4gIF07XHJcbiAgcHVibGljIHN0YXRpYyBGaXJzdFRpbWVTdWJzY3JpYmVkQXR0YWNobWVudEFycmF5OkFycmF5PGFueT49W1xyXG4gICAge1xyXG4gICAgICBwYXRoOiBwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSsnaW1hZ2VzL2xvZ28vYXBwbGljYXRpb24tbG9nby5wbmcnLFxyXG4gICAgICBjaWQ6ICd1bmlxdWVAYXBwbGljYXRpb24tbG9nbydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHBhdGg6ICBwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSsnaW1hZ2VzL2Jhbm5lci9zdWNjZXNzZnVsbHktc3Vic2NyaWJlZC5wbmcnLFxyXG4gICAgICBjaWQ6ICd1bmlxdWVAZmlyc3QtdGltZS1zdWJzY3JpYmVkJ1xyXG4gICAgfVxyXG4gIF07XHJcbn1cclxuZXhwb3J0PU1haWxBdHRhY2htZW50cztcclxuIl19
