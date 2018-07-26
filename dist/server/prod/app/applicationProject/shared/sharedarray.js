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
        }, {
            path: path.resolve() + config.get('application.publicPath') + 'images/banner/password-reset.png',
            cid: 'unique@password-reset'
        }
    ];
    return MailAttachments;
}());
module.exports = MailAttachments;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL3NoYXJlZGFycmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCO0lBQUE7SUFnQkEsQ0FBQztJQWZlLCtCQUFlLEdBQWU7UUFDMUM7WUFDRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDOUYsR0FBRyxFQUFFLHlCQUF5QjtTQUMvQjtLQUNGLENBQUM7SUFDWSw2Q0FBNkIsR0FBZTtRQUN4RDtZQUNFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFDLGtDQUFrQztZQUM5RixHQUFHLEVBQUUseUJBQXlCO1NBQy9CLEVBQUU7WUFDRCxJQUFJLEVBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsR0FBQyxrQ0FBa0M7WUFDL0YsR0FBRyxFQUFFLHVCQUF1QjtTQUM3QjtLQUNGLENBQUM7SUFDSixzQkFBQztDQWhCRCxBQWdCQyxJQUFBO0FBQ0QsaUJBQU8sZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL3NoYXJlZGFycmF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuY2xhc3MgTWFpbEF0dGFjaG1lbnRzIHtcclxuICBwdWJsaWMgc3RhdGljIEF0dGFjaG1lbnRBcnJheTogQXJyYXk8YW55PiA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykrJ2ltYWdlcy9sb2dvL2FwcGxpY2F0aW9uLWxvZ28ucG5nJyxcclxuICAgICAgY2lkOiAndW5pcXVlQGFwcGxpY2F0aW9uLWxvZ28nXHJcbiAgICB9XHJcbiAgXTtcclxuICBwdWJsaWMgc3RhdGljIEZvcmdldFBhc3N3b3JkQXR0YWNobWVudEFycmF5OiBBcnJheTxhbnk+ID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiBwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSsnaW1hZ2VzL2xvZ28vYXBwbGljYXRpb24tbG9nby5wbmcnLFxyXG4gICAgICBjaWQ6ICd1bmlxdWVAYXBwbGljYXRpb24tbG9nbydcclxuICAgIH0sIHtcclxuICAgICAgcGF0aDogIHBhdGgucmVzb2x2ZSgpICsgY29uZmlnLmdldCgnYXBwbGljYXRpb24ucHVibGljUGF0aCcpKydpbWFnZXMvYmFubmVyL3Bhc3N3b3JkLXJlc2V0LnBuZycsXHJcbiAgICAgIGNpZDogJ3VuaXF1ZUBwYXNzd29yZC1yZXNldCdcclxuICAgIH1cclxuICBdO1xyXG59XHJcbmV4cG9ydD1NYWlsQXR0YWNobWVudHM7XHJcbiJdfQ==
