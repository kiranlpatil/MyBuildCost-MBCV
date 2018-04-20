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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF5QztBQUN6Qyx1REFBMEQ7QUFDMUQsOERBQWlFO0FBQ2pFLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFHN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFbEU7SUFBQTtJQWlDQSxDQUFDO0lBeEJDLDhCQUFJLEdBQUosVUFBSyxVQUFrQixFQUFFLE9BQWUsRUFBRSxZQUFvQixFQUN6RCxJQUF5QixFQUN6QixRQUF5RCxFQUFFLFVBQW1CLEVBQUMsVUFBZTtRQUVqRyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEdBQUcsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzlILElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFhLEVBQUUsR0FBVztZQUN0QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRztZQUNoQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQztZQUNoRCxFQUFFLEVBQUUsVUFBVTtZQUNkLEVBQUUsRUFBRSxVQUFVO1lBQ2QsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLE9BQU87WUFDYixXQUFXLEVBQUMsVUFBVSxHQUFDLFVBQVUsR0FBRSxlQUFlLENBQUMsZUFBZTtTQUNuRSxDQUFDO1FBQ0YsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQVUsS0FBWSxFQUFFLFFBQXlCO1lBQ25HLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQ0QsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUEvQk0sNkJBQWEsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ2hELE9BQU8sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDO1FBQ3BELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDO1lBQ2hELElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDO1NBQzFEO0tBQ0YsQ0FBQyxDQUFDO0lBMEJMLHNCQUFDO0NBakNELEFBaUNDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdCLGlCQUFTLGVBQWUsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL21haWxlci5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJztcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcbmltcG9ydCBMb2dnZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL2xvZ2dlci9Mb2dnZXJTZXJ2aWNlJyk7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2VudE1lc3NhZ2VJbmZvIH0gZnJvbSAnbm9kZW1haWxlcic7XG5cbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcbmxldCBsb2dnZXJTZXJ2aWNlID0gbmV3IExvZ2dlclNlcnZpY2UoJ01BSUxDSElNUF9NQUlMRVJfU0VSVklDRScpO1xuXG5jbGFzcyBTZW5kTWFpbFNlcnZpY2Uge1xuICBzdGF0aWMgc210cFRyYW5zcG9ydCA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgICBzZXJ2aWNlOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VSVklDRScpLFxuICAgIGF1dGg6IHtcbiAgICAgIHVzZXI6IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVInKSxcbiAgICAgIHBhc3M6IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVJfUEFTU1dPUkQnKVxuICAgIH1cbiAgfSk7XG5cbiAgc2VuZChzZW5kbWFpbFRvOiBzdHJpbmcsIHN1YmplY3Q6IHN0cmluZywgdGVtcGxhdGVOYW1lOiBzdHJpbmcsXG4gICAgICAgZGF0YTogTWFwPHN0cmluZywgc3RyaW5nPixcbiAgICAgICBjYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQsIGNhcmJvbkNvcHk/OiBzdHJpbmcsYXR0YWNobWVudD86YW55KSB7XG5cbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSArICd0ZW1wbGF0ZXMvJyArIHRlbXBsYXRlTmFtZSkudG9TdHJpbmcoKTtcbiAgICBkYXRhLmZvckVhY2goKHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKGtleSwgdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xuICAgICAgZnJvbTogY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5NQUlMX1NFTkRFUicpLFxuICAgICAgdG86IHNlbmRtYWlsVG8sXG4gICAgICBjYzogY2FyYm9uQ29weSxcbiAgICAgIHN1YmplY3Q6IHN1YmplY3QsXG4gICAgICBodG1sOiBjb250ZW50LFxuICAgICAgYXR0YWNobWVudHM6YXR0YWNobWVudD9hdHRhY2htZW50OiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XG4gICAgfTtcbiAgICBTZW5kTWFpbFNlcnZpY2Uuc210cFRyYW5zcG9ydC5zZW5kTWFpbChtYWlsT3B0aW9ucywgZnVuY3Rpb24gKGVycm9yOiBFcnJvciwgcmVzcG9uc2U6IFNlbnRNZXNzYWdlSW5mbykge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJyBFcnJvciBpbiBtYWlsIHNlbmQgJyArIGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVycm9yLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuT2JqZWN0LnNlYWwoU2VuZE1haWxTZXJ2aWNlKTtcbmV4cG9ydCA9IFNlbmRNYWlsU2VydmljZTtcbiJdfQ==
