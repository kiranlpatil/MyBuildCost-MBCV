"use strict";
var nodemailer = require("nodemailer");
var Messages = require("../shared/messages");
var config = require('config');
var SendMailService = (function () {
    function SendMailService() {
    }
    SendMailService.prototype.sendMail = function (mailOptions, callback) {
        var smtpTransport = nodemailer.createTransport({
            service: config.get('TplSeed.mail.MAIL_SERVICE'),
            auth: {
                user: config.get('TplSeed.mail.MAIL_SENDER'),
                pass: config.get('TplSeed.mail.MAIL_SENDER_PASSWORD')
            }
        });
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                callback(new Error(Messages.MSG_ERROR_EMAIL), response);
            }
            else {
                callback(null, response);
            }
        });
    };
    return SendMailService;
}());
Object.seal(SendMailService);
module.exports = SendMailService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvc2VuZG1haWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXlDO0FBQ3pDLDZDQUE4QztBQUM5QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0I7SUFBQTtJQXNCQSxDQUFDO0lBcEJDLGtDQUFRLEdBQVIsVUFBUyxXQUFnQixFQUFFLFFBQWE7UUFDdEMsSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQztZQUM3QyxPQUFPLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQztZQUUvQyxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7Z0JBQzVDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDO2FBQ3REO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxLQUFVLEVBQUUsUUFBYTtZQUNyRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0F0QkEsQUFzQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvc2VuZG1haWwuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5vZGVtYWlsZXIgZnJvbSBcIm5vZGVtYWlsZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VzPXJlcXVpcmUoXCIuLi9zaGFyZWQvbWVzc2FnZXNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbmNsYXNzIFNlbmRNYWlsU2VydmljZSB7XHJcblxyXG4gIHNlbmRNYWlsKG1haWxPcHRpb25zOiBhbnksIGNhbGxiYWNrOiBhbnkpIHtcclxuICAgIGxldCBzbXRwVHJhbnNwb3J0ID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgICBzZXJ2aWNlOmNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5NQUlMX1NFUlZJQ0UnKSxcclxuXHJcbiAgICAgIGF1dGg6IHtcclxuICAgICAgICB1c2VyOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgICBwYXNzOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVJfUEFTU1dPUkQnKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBzbXRwVHJhbnNwb3J0LnNlbmRNYWlsKG1haWxPcHRpb25zLCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMKSwgcmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoU2VuZE1haWxTZXJ2aWNlKTtcclxuZXhwb3J0ID0gU2VuZE1haWxTZXJ2aWNlO1xyXG4iXX0=
