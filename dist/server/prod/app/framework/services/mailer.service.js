"use strict";
var nodemailer = require("nodemailer");
var LoggerService = require("../shared/logger/LoggerService");
var fs = require("fs");
var path = require("path");
var config = require('config');
var loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');
var SendMailService = (function () {
    function SendMailService() {
    }
    SendMailService.prototype.send = function (sendmailTo, subject, templateName, data, attachment, callback, blankCarbonCopy) {
        var content = fs.readFileSync(path.resolve() + config.get('application.publicPath') + 'templates/' + templateName).toString();
        data.forEach(function (value, key) {
            content = content.replace(key, value);
        });
        loggerService.logDebug('Sending mail from mail service.');
        var mailOptions = {
            from: config.get('application.mail.MAIL_SENDER'),
            to: sendmailTo,
            bcc: blankCarbonCopy,
            subject: subject,
            html: content,
            attachments: attachment
        };
        SendMailService.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                loggerService.logError(' Error in mail send ' + error);
            }
            loggerService.logDebug(' response in mail send ' + response);
            callback(error, response);
        });
    };
    SendMailService.smtpTransport = nodemailer.createTransport({
        service: config.get('application.mail.MAIL_SERVICE'),
        auth: {
            user: config.get('application.mail.MAIL_SENDER'),
            pass: config.get('application.mail.MAIL_SENDER_PASSWORD')
        },
        tls: { rejectUnauthorized: false }
    });
    return SendMailService;
}());
Object.seal(SendMailService);
module.exports = SendMailService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF5QztBQUV6Qyw4REFBaUU7QUFDakUsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUc3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUVsRTtJQUFBO0lBc0NBLENBQUM7SUEzQkMsOEJBQUksR0FBSixVQUFLLFVBQWtCLEVBQUUsT0FBZSxFQUFFLFlBQW9CLEVBQ3pELElBQXlCLEVBQUUsVUFBaUIsRUFDNUMsUUFBeUQsRUFBRSxlQUF3QjtRQUV0RixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlILElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFhLEVBQUUsR0FBVztZQUN0QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxhQUFhLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUM7WUFDaEQsRUFBRSxFQUFFLFVBQVU7WUFDZCxHQUFHLEVBQUUsZUFBZTtZQUNwQixPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsT0FBTztZQUNiLFdBQVcsRUFBQyxVQUFVO1NBRXZCLENBQUM7UUFDRixlQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxLQUFZLEVBQUUsUUFBeUI7WUFDbkcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixhQUFhLENBQUMsUUFBUSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFDRCxhQUFhLENBQUMsUUFBUSxDQUFDLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQzdELFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBbkNNLDZCQUFhLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUNoRCxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztRQUNwRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQztZQUNoRCxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQztTQUMxRDtRQUNELEdBQUcsRUFBRSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRTtLQUNuQyxDQUFDLENBQUM7SUE2Qkwsc0JBQUM7Q0F0Q0QsQUFzQ0MsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBub2RlbWFpbGVyIGZyb20gJ25vZGVtYWlsZXInO1xyXG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XHJcbmltcG9ydCBMb2dnZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL2xvZ2dlci9Mb2dnZXJTZXJ2aWNlJyk7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgU2VudE1lc3NhZ2VJbmZvIH0gZnJvbSAnbm9kZW1haWxlcic7XHJcblxyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBsb2dnZXJTZXJ2aWNlID0gbmV3IExvZ2dlclNlcnZpY2UoJ01BSUxDSElNUF9NQUlMRVJfU0VSVklDRScpO1xyXG5cclxuY2xhc3MgU2VuZE1haWxTZXJ2aWNlIHtcclxuICAvL3Byb2Nlc3MuZW52Lk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQgOiBhbnkgPSAnMCc7XHJcbiAgc3RhdGljIHNtdHBUcmFuc3BvcnQgPSBub2RlbWFpbGVyLmNyZWF0ZVRyYW5zcG9ydCh7XHJcbiAgICBzZXJ2aWNlOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VSVklDRScpLFxyXG4gICAgYXV0aDoge1xyXG4gICAgICB1c2VyOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHBhc3M6IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVJfUEFTU1dPUkQnKVxyXG4gICAgfSxcclxuICAgIHRsczogeyByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlIH1cclxuICB9KTtcclxuXHJcbiAgc2VuZChzZW5kbWFpbFRvOiBzdHJpbmcsIHN1YmplY3Q6IHN0cmluZywgdGVtcGxhdGVOYW1lOiBzdHJpbmcsXHJcbiAgICAgICBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+LCBhdHRhY2htZW50PzphbnlbXSxcclxuICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCwgYmxhbmtDYXJib25Db3B5Pzogc3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykgKyAndGVtcGxhdGVzLycgKyB0ZW1wbGF0ZU5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICBkYXRhLmZvckVhY2goKHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uoa2V5LCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuICAgIGxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1NlbmRpbmcgbWFpbCBmcm9tIG1haWwgc2VydmljZS4nKTtcclxuXHJcbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IHNlbmRtYWlsVG8sXHJcbiAgICAgIGJjYzogYmxhbmtDYXJib25Db3B5LFxyXG4gICAgICBzdWJqZWN0OiBzdWJqZWN0LFxyXG4gICAgICBodG1sOiBjb250ZW50LFxyXG4gICAgICBhdHRhY2htZW50czphdHRhY2htZW50XHJcbiAgICAgIC8qYXR0YWNobWVudD9hdHRhY2htZW50OiBNYWlsQXR0YWNobWVudHMuV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheSovXHJcbiAgICB9O1xyXG4gICAgU2VuZE1haWxTZXJ2aWNlLnNtdHBUcmFuc3BvcnQuc2VuZE1haWwobWFpbE9wdGlvbnMsIGZ1bmN0aW9uIChlcnJvcjogRXJyb3IsIHJlc3BvbnNlOiBTZW50TWVzc2FnZUluZm8pIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyU2VydmljZS5sb2dFcnJvcignIEVycm9yIGluIG1haWwgc2VuZCAnICsgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGxvZ2dlclNlcnZpY2UubG9nRGVidWcoJyByZXNwb25zZSBpbiBtYWlsIHNlbmQgJyArIHJlc3BvbnNlKTtcclxuICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoU2VuZE1haWxTZXJ2aWNlKTtcclxuZXhwb3J0ID0gU2VuZE1haWxTZXJ2aWNlO1xyXG4iXX0=
