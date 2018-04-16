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
        if (config.has('application.publicPath')) {
            console.log('PUBLICpATH: ' + JSON.stringify(config.get('application.publicPath')));
        }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvbWFpbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF5QztBQUN6Qyx1REFBMEQ7QUFDMUQsOERBQWlFO0FBQ2pFLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFHN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFFbEU7SUFBQTtJQW1DQSxDQUFDO0lBMUJDLDhCQUFJLEdBQUosVUFBSyxVQUFrQixFQUFFLE9BQWUsRUFBRSxZQUFvQixFQUN6RCxJQUF5QixFQUN6QixRQUF5RCxFQUFFLFVBQW1CLEVBQUMsVUFBZTtRQUNqRyxFQUFFLENBQUEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5SCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYSxFQUFFLEdBQVc7WUFDdEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUM7WUFDaEQsRUFBRSxFQUFFLFVBQVU7WUFDZCxFQUFFLEVBQUUsVUFBVTtZQUNkLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLElBQUksRUFBRSxPQUFPO1lBQ2IsV0FBVyxFQUFDLFVBQVUsR0FBQyxVQUFVLEdBQUUsZUFBZSxDQUFDLGVBQWU7U0FDbkUsQ0FBQztRQUNGLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQVksRUFBRSxRQUF5QjtZQUNuRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLGFBQWEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDekQsQ0FBQztZQUNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBakNNLDZCQUFhLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztRQUNoRCxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztRQUNwRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQztZQUNoRCxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQztTQUMxRDtLQUNGLENBQUMsQ0FBQztJQTRCTCxzQkFBQztDQW5DRCxBQW1DQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM3QixpQkFBUyxlQUFlLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9tYWlsZXIuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcic7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IExvZ2dlclNlcnZpY2UgPSByZXF1aXJlKCcuLi9zaGFyZWQvbG9nZ2VyL0xvZ2dlclNlcnZpY2UnKTtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBTZW50TWVzc2FnZUluZm8gfSBmcm9tICdub2RlbWFpbGVyJztcclxuXHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGxvZ2dlclNlcnZpY2UgPSBuZXcgTG9nZ2VyU2VydmljZSgnTUFJTENISU1QX01BSUxFUl9TRVJWSUNFJyk7XHJcblxyXG5jbGFzcyBTZW5kTWFpbFNlcnZpY2Uge1xyXG4gIHN0YXRpYyBzbXRwVHJhbnNwb3J0ID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgc2VydmljZTogY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5NQUlMX1NFUlZJQ0UnKSxcclxuICAgIGF1dGg6IHtcclxuICAgICAgdXNlcjogY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5NQUlMX1NFTkRFUicpLFxyXG4gICAgICBwYXNzOiBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLk1BSUxfU0VOREVSX1BBU1NXT1JEJylcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgc2VuZChzZW5kbWFpbFRvOiBzdHJpbmcsIHN1YmplY3Q6IHN0cmluZywgdGVtcGxhdGVOYW1lOiBzdHJpbmcsXHJcbiAgICAgICBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+LFxyXG4gICAgICAgY2FsbGJhY2s6IChlcnJvcjogRXJyb3IsIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkLCBjYXJib25Db3B5Pzogc3RyaW5nLGF0dGFjaG1lbnQ/OmFueSkge1xyXG4gICAgaWYoY29uZmlnLmhhcygnYXBwbGljYXRpb24ucHVibGljUGF0aCcpKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdQVUJMSUNwQVRIOiAnK0pTT04uc3RyaW5naWZ5KGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnB1YmxpY1BhdGgnKSkpO1xyXG4gICAgfVxyXG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wdWJsaWNQYXRoJykgKyAndGVtcGxhdGVzLycgKyB0ZW1wbGF0ZU5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICBkYXRhLmZvckVhY2goKHZhbHVlOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2Uoa2V5LCB2YWx1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IHNlbmRtYWlsVG8sXHJcbiAgICAgIGNjOiBjYXJib25Db3B5LFxyXG4gICAgICBzdWJqZWN0OiBzdWJqZWN0LFxyXG4gICAgICBodG1sOiBjb250ZW50LFxyXG4gICAgICBhdHRhY2htZW50czphdHRhY2htZW50P2F0dGFjaG1lbnQ6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgIH07XHJcbiAgICBTZW5kTWFpbFNlcnZpY2Uuc210cFRyYW5zcG9ydC5zZW5kTWFpbChtYWlsT3B0aW9ucywgZnVuY3Rpb24gKGVycm9yOiBFcnJvciwgcmVzcG9uc2U6IFNlbnRNZXNzYWdlSW5mbykge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCcgRXJyb3IgaW4gbWFpbCBzZW5kICcgKyBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3BvbnNlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoU2VuZE1haWxTZXJ2aWNlKTtcclxuZXhwb3J0ID0gU2VuZE1haWxTZXJ2aWNlO1xyXG4iXX0=
