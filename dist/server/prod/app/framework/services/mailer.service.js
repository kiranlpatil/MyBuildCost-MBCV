"use strict";
var nodemailer = require("nodemailer");
var MailAttachments = require("../shared/sharedarray");
var LoggerService = require("../shared/logger/LoggerService");
var fs = require("fs");
var path = require("path");
var config = require('config');
var loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');
var SendMailService = (function () {
    function SendMailService() {
    }
    SendMailService.prototype.send = function (sendmailTo, subject, templateName, data, callback, carbonCopy, attachment) {
        var content = fs.readFileSync(path.resolve() + config.get('application.publicPath') + 'templates/' + templateName).toString();
        data.forEach(function (value, key) {
            content = content.replace(key, value);
        });
        var mailOptions = {
            from: config.get('application.mail.MAIL_SENDER'),
            to: sendmailTo,
            cc: carbonCopy,
            subject: subject,
            html: content,
            attachments: attachment ? attachment : MailAttachments.AttachmentArray
        };
        SendMailService.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                loggerService.logError(' Error in mail send ' + error);
            }
            callback(error, response);
        });
    };
    SendMailService.smtpTransport = nodemailer.createTransport({
        service: config.get('application.mail.MAIL_SERVICE'),
        auth: {
            user: config.get('application.mail.MAIL_SENDER'),
            pass: config.get('application.mail.MAIL_SENDER_PASSWORD')
        }
    });
    return SendMailService;
}());
Object.seal(SendMailService);
module.exports = SendMailService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF5QztBQUN6Qyx1REFBMEQ7QUFDMUQsOERBQWlFO0FBQ2pFLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFHN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFbEU7SUFBQTtJQWdDQSxDQUFDO0lBdkJDLDhCQUFJLEdBQUosVUFBSyxVQUFrQixFQUFFLE9BQWUsRUFBRSxZQUFvQixFQUN6RCxJQUF5QixFQUN6QixRQUF5RCxFQUFFLFVBQW1CLEVBQUMsVUFBZTtRQUNqRyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlILElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFhLEVBQUUsR0FBVztZQUN0QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRztZQUNoQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQztZQUNoRCxFQUFFLEVBQUUsVUFBVTtZQUNkLEVBQUUsRUFBRSxVQUFVO1lBQ2QsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLE9BQU87WUFDYixXQUFXLEVBQUMsVUFBVSxHQUFDLFVBQVUsR0FBRSxlQUFlLENBQUMsZUFBZTtTQUNuRSxDQUFDO1FBQ0YsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQVUsS0FBWSxFQUFFLFFBQXlCO1lBQ25HLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQ0QsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUE5Qk0sNkJBQWEsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ2hELE9BQU8sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDO1FBQ3BELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDO1lBQ2hELElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDO1NBQzFEO0tBQ0YsQ0FBQyxDQUFDO0lBeUJMLHNCQUFDO0NBaENELEFBZ0NDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdCLGlCQUFTLGVBQWUsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL21haWxlci5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJztcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xyXG5pbXBvcnQgTG9nZ2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9sb2dnZXIvTG9nZ2VyU2VydmljZScpO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IFNlbnRNZXNzYWdlSW5mbyB9IGZyb20gJ25vZGVtYWlsZXInO1xyXG5cclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQgbG9nZ2VyU2VydmljZSA9IG5ldyBMb2dnZXJTZXJ2aWNlKCdNQUlMQ0hJTVBfTUFJTEVSX1NFUlZJQ0UnKTtcclxuXHJcbmNsYXNzIFNlbmRNYWlsU2VydmljZSB7XHJcbiAgc3RhdGljIHNtdHBUcmFuc3BvcnQgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XHJcbiAgICBzZXJ2aWNlOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VSVklDRScpLFxyXG4gICAgYXV0aDoge1xyXG4gICAgICB1c2VyOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHBhc3M6IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVJfUEFTU1dPUkQnKVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBzZW5kKHNlbmRtYWlsVG86IHN0cmluZywgc3ViamVjdDogc3RyaW5nLCB0ZW1wbGF0ZU5hbWU6IHN0cmluZyxcclxuICAgICAgIGRhdGE6IE1hcDxzdHJpbmcsIHN0cmluZz4sXHJcbiAgICAgICBjYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQsIGNhcmJvbkNvcHk/OiBzdHJpbmcsYXR0YWNobWVudD86YW55KSB7XHJcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSArICd0ZW1wbGF0ZXMvJyArIHRlbXBsYXRlTmFtZSkudG9TdHJpbmcoKTtcclxuICAgIGRhdGEuZm9yRWFjaCgodmFsdWU6IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShrZXksIHZhbHVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgZnJvbTogY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5NQUlMX1NFTkRFUicpLFxyXG4gICAgICB0bzogc2VuZG1haWxUbyxcclxuICAgICAgY2M6IGNhcmJvbkNvcHksXHJcbiAgICAgIHN1YmplY3Q6IHN1YmplY3QsXHJcbiAgICAgIGh0bWw6IGNvbnRlbnQsXHJcbiAgICAgIGF0dGFjaG1lbnRzOmF0dGFjaG1lbnQ/YXR0YWNobWVudDogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgfTtcclxuICAgIFNlbmRNYWlsU2VydmljZS5zbXRwVHJhbnNwb3J0LnNlbmRNYWlsKG1haWxPcHRpb25zLCBmdW5jdGlvbiAoZXJyb3I6IEVycm9yLCByZXNwb25zZTogU2VudE1lc3NhZ2VJbmZvKSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJyBFcnJvciBpbiBtYWlsIHNlbmQgJyArIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBjYWxsYmFjayhlcnJvciwgcmVzcG9uc2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChTZW5kTWFpbFNlcnZpY2UpO1xyXG5leHBvcnQgPSBTZW5kTWFpbFNlcnZpY2U7XHJcbiJdfQ==
