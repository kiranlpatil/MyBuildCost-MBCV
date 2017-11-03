"use strict";
var UserRepository = require("../dataaccess/repository/user.repository");
var SendMailService = require("./sendmail.service");
var SendMessageService = require("./sendmessage.service");
var fs = require("fs");
var mongoose = require("mongoose");
var config = require('config');
var Messages = require("../shared/messages");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var ProjectAsset = require("../shared/projectasset");
var MailAttachments = require("../shared/sharedarray");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var UserService = (function () {
    function UserService() {
        this.userRepository = new UserRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    UserService.prototype.createUser = function (item, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'email': item.email }, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else if (res.length > 0) {
                if (res[0].isActivated === true) {
                    callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
                }
                else if (res[0].isActivated === false) {
                    callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
                }
            }
            else {
                _this.userRepository.create(item, function (err, res) {
                    if (err) {
                        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                    }
                    else {
                        callback(null, res);
                    }
                });
            }
        });
    };
    ;
    UserService.prototype.generateOtp = function (field, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'mobile_number': field.new_mobile_number, 'isActivated': true }, function (err, res) {
            if (err) {
            }
            else if (res.length > 0 && (res[0]._id) !== field._id) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
            else if (res.length === 0) {
                var query = { '_id': field._id };
                var otp_1 = Math.floor((Math.random() * 99999) + 100000);
                var updateData = { 'mobile_number': field.new_mobile_number, 'otp': otp_1 };
                _this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                    if (error) {
                        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                    }
                    else {
                        var Data = {
                            mobileNo: field.new_mobile_number,
                            otp: otp_1
                        };
                        var sendMessageService = new SendMessageService();
                        sendMessageService.sendMessageDirect(Data, callback);
                    }
                });
            }
            else {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
        });
    };
    UserService.prototype.changeMobileNumber = function (field, callback) {
        var query = { '_id': field._id };
        var otp = Math.floor((Math.random() * 99999) + 100000);
        var updateData = { 'otp': otp, 'temp_mobile': field.new_mobile_number };
        this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
            }
            else {
                var Data = {
                    current_mobile_number: field.current_mobile_number,
                    mobileNo: field.new_mobile_number,
                    otp: otp
                };
                var sendMessageService = new SendMessageService();
                sendMessageService.sendChangeMobileMessage(Data, callback);
            }
        });
    };
    UserService.prototype.forgotPassword = function (field, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'email': field.email }, function (err, res) {
            if (res.length > 0 && res[0].isActivated === true) {
                var header1_1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
                var content_1 = fs.readFileSync('./src/server/app/framework/public/forgotpassword.html').toString();
                var footer1_1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(res[0]);
                var host = config.get('TplSeed.mail.host');
                var link_1 = host + 'reset_password?access_token=' + token + '&_id=' + res[0]._id;
                if (res[0].isCandidate === true) {
                    _this.mid_content = content_1.replace('$link$', link_1).replace('$first_name$', res[0].first_name).replace('$app_name$', _this.APP_NAME);
                    var mailOptions = {
                        from: config.get('TplSeed.mail.MAIL_SENDER'),
                        to: field.email,
                        subject: Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
                        html: header1_1 + _this.mid_content + footer1_1,
                        attachments: MailAttachments.AttachmentArray
                    };
                    var sendMailService = new SendMailService();
                    sendMailService.sendMail(mailOptions, callback);
                }
                else {
                    _this.recruiterRepository.retrieve({ 'userId': new mongoose.Types.ObjectId(res[0]._id) }, function (err, recruiter) {
                        if (err) {
                            callback(err, null);
                        }
                        else {
                            _this.company_name = recruiter[0].company_name;
                            _this.mid_content = content_1.replace('$link$', link_1).replace('$first_name$', _this.company_name).replace('$app_name$', _this.APP_NAME);
                            var mailOptions = {
                                from: config.get('TplSeed.mail.MAIL_SENDER'),
                                to: field.email,
                                subject: Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
                                html: header1_1 + _this.mid_content + footer1_1,
                                attachments: MailAttachments.AttachmentArray
                            };
                            var sendMailService = new SendMailService();
                            sendMailService.sendMail(mailOptions, callback);
                        }
                    });
                }
            }
            else if (res.length > 0 && res[0].isActivated === false) {
                callback(new Error(Messages.MSG_ERROR_ACCOUNT_STATUS), res);
            }
            else {
                callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
            }
        });
    };
    UserService.prototype.SendChangeMailVerification = function (field, callback) {
        var query = { 'email': field.current_email, 'isActivated': true };
        var updateData = { 'temp_email': field.new_email };
        this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);
            }
            else {
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(result);
                var host = config.get('TplSeed.mail.host');
                var link = host + 'activate_user?access_token=' + token + '&_id=' + result._id + 'isEmailVerification';
                var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
                var content = fs.readFileSync('./src/server/app/framework/public/change.mail.html').toString();
                var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
                var mid_content = content.replace('$link$', link);
                var mailOptions = {
                    from: config.get('TplSeed.mail.MAIL_SENDER'),
                    to: field.new_email,
                    subject: Messages.EMAIL_SUBJECT_CHANGE_EMAILID,
                    html: header1 + mid_content + footer1,
                    attachments: MailAttachments.AttachmentArray
                };
                var sendMailService = new SendMailService();
                sendMailService.sendMail(mailOptions, callback);
            }
        });
    };
    UserService.prototype.sendVerificationMail = function (field, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'email': field.email }, function (err, res) {
            if (res.length > 0) {
                _this.recruiterRepository.retrieve({ 'userId': new mongoose.Types.ObjectId(res[0]._id) }, function (err, recruiter) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        _this.company_name = recruiter[0].company_name;
                        var auth = new AuthInterceptor();
                        var token = auth.issueTokenWithUid(recruiter[0]);
                        var host = config.get('TplSeed.mail.host');
                        var link = host + 'company_details?access_token=' + token + '&_id=' + res[0]._id + '&companyName=' + _this.company_name;
                        var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
                        var content = fs.readFileSync('./src/server/app/framework/public/recruiter.mail.html').toString();
                        var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
                        var mid_content = content.replace('$link$', link);
                        var mailOptions = {
                            from: config.get('TplSeed.mail.MAIL_SENDER'),
                            to: field.email,
                            subject: Messages.EMAIL_SUBJECT_REGISTRATION,
                            html: header1 + mid_content + footer1,
                            attachments: MailAttachments.AttachmentArray
                        };
                        var sendMailService = new SendMailService();
                        sendMailService.sendMail(mailOptions, callback);
                    }
                });
            }
            else {
                callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
            }
        });
    };
    UserService.prototype.sendRecruiterVerificationMail = function (field, callback) {
        this.userRepository.retrieve({ 'email': field.email }, function (err, res) {
            if (res.length > 0) {
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(res[0]);
                var host = config.get('TplSeed.mail.host');
                var link = host + 'activate_user?access_token=' + token + '&_id=' + res[0]._id;
                var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
                var content = fs.readFileSync('./src/server/app/framework/public/recruiter.mail.html').toString();
                var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
                var mid_content = content.replace('$link$', link);
                var mailOptions = {
                    from: config.get('TplSeed.mail.MAIL_SENDER'),
                    to: field.email,
                    subject: Messages.EMAIL_SUBJECT_REGISTRATION,
                    html: header1 + mid_content + footer1,
                    attachments: MailAttachments.AttachmentArray
                };
                var sendMailService = new SendMailService();
                sendMailService.sendMail(mailOptions, callback);
            }
            else {
                callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
            }
        });
    };
    UserService.prototype.sendMail = function (field, callback) {
        var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
        var content = fs.readFileSync('./src/server/app/framework/public/contactus.mail.html').toString();
        var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
        var mid_content = content.replace('$first_name$', field.first_name).replace('$email$', field.email).replace('$message$', field.message);
        var to = config.get('TplSeed.mail.ADMIN_MAIL');
        var mailOptions = {
            from: config.get('TplSeed.mail.MAIL_SENDER'),
            to: to,
            subject: Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU,
            html: header1 + mid_content + footer1,
            attachments: MailAttachments.AttachmentArray
        };
        var sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);
    };
    UserService.prototype.sendMailOnError = function (errorInfo, callback) {
        var current_Time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
        var content = fs.readFileSync('./src/server/app/framework/public/error.mail.html').toString();
        var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
        var mid_content = content.replace('$time$', current_Time).replace('$host$', config.get('TplSeed.mail.host')).replace('$reason$', errorInfo.reason).replace('$code$', errorInfo.code).replace('$message$', errorInfo.message);
        if (errorInfo.stackTrace) {
            mid_content = mid_content.replace('$error$', errorInfo.stackTrace.stack);
        }
        else if (errorInfo.stack) {
            mid_content = mid_content.replace('$error$', errorInfo.stack);
        }
        var mailOptions = {
            from: config.get('TplSeed.mail.MAIL_SENDER'),
            to: config.get('TplSeed.mail.ADMIN_MAIL'),
            cc: config.get('TplSeed.mail.TPLGROUP_MAIL'),
            subject: Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('TplSeed.mail.host'),
            html: header1 + mid_content + footer1,
            attachments: MailAttachments.AttachmentArray
        };
        var sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);
    };
    UserService.prototype.findById = function (id, callback) {
        this.userRepository.findById(id, callback);
    };
    UserService.prototype.retrieve = function (field, callback) {
        this.userRepository.retrieveWithLean(field, {}, callback);
    };
    UserService.prototype.retrieveWithLimit = function (field, included, callback) {
        var limit = config.get('TplSeed.limitForQuery');
        this.userRepository.retrieveWithLimit(field, included, limit, callback);
    };
    UserService.prototype.retrieveWithLean = function (field, callback) {
        this.userRepository.retrieve(field, callback);
    };
    UserService.prototype.retrieveAll = function (item, callback) {
        this.userRepository.retrieve(item, function (err, res) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    ;
    UserService.prototype.update = function (_id, item, callback) {
        var _this = this;
        this.userRepository.findById(_id, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.userRepository.update(res._id, item, callback);
            }
        });
    };
    UserService.prototype.delete = function (_id, callback) {
        this.userRepository.delete(_id, callback);
    };
    UserService.prototype.findOneAndUpdate = function (query, newData, options, callback) {
        this.userRepository.findOneAndUpdate(query, newData, options, callback);
    };
    UserService.prototype.UploadImage = function (tempPath, fileName, cb) {
        var targetpath = fileName;
        fs.rename(tempPath, targetpath, function (err) {
            cb(null, tempPath);
        });
    };
    UserService.prototype.UploadDocuments = function (tempPath, fileName, cb) {
        var targetpath = fileName;
        fs.rename(tempPath, targetpath, function (err) {
            cb(null, tempPath);
        });
    };
    UserService.prototype.findAndUpdateNotification = function (query, newData, options, callback) {
        this.userRepository.findOneAndUpdate(query, newData, options, callback);
    };
    UserService.prototype.retrieveBySortedOrder = function (query, projection, sortingQuery, callback) {
        this.userRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
    };
    return UserService;
}());
Object.seal(UserService);
module.exports = UserService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5RUFBNEU7QUFDNUUsb0RBQXVEO0FBQ3ZELDBEQUE2RDtBQUM3RCx1QkFBeUI7QUFDekIsbUNBQXFDO0FBQ3JDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQiw2Q0FBZ0Q7QUFDaEQsOEVBQWlGO0FBQ2pGLHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFDMUQsbUZBQXNGO0FBRXRGO0lBUUU7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELGdDQUFVLEdBQVYsVUFBVyxJQUFTLEVBQUUsUUFBMkM7UUFBakUsaUJBd0JDO1FBdkJDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUxQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9ELENBQUM7WUFFSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7b0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMzRSxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBRUgsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBQUEsQ0FBQztJQUdGLGlDQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBMkM7UUFBbkUsaUJBNEJDO1FBM0JDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUVyRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1YsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QixJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFDLENBQUM7Z0JBQy9CLElBQUksS0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBRXZELElBQUksVUFBVSxHQUFHLEVBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsS0FBRyxFQUFDLENBQUM7Z0JBQ3hFLEtBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO29CQUNqRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNWLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsb0NBQW9DLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0UsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLElBQUksR0FBRzs0QkFDVCxRQUFRLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjs0QkFDakMsR0FBRyxFQUFFLEtBQUc7eUJBQ1QsQ0FBQzt3QkFDRixJQUFJLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQzt3QkFDbEQsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN2RCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsb0NBQW9DLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0NBQWtCLEdBQWxCLFVBQW1CLEtBQVUsRUFBRSxRQUEyQztRQUV4RSxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFDLENBQUM7UUFFL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLFVBQVUsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBQyxDQUFDO1FBRXRFLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQ2pGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLElBQUksR0FBRztvQkFDVCxxQkFBcUIsRUFBRSxLQUFLLENBQUMscUJBQXFCO29CQUNsRCxRQUFRLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtvQkFDakMsR0FBRyxFQUFFLEdBQUc7aUJBQ1QsQ0FBQztnQkFDRixJQUFJLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztnQkFDbEQsa0JBQWtCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRTdELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFRCxvQ0FBYyxHQUFkLFVBQWUsS0FBVSxFQUFFLFFBQTJDO1FBQXRFLGlCQXNEQztRQXBEQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUM1RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksU0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDM0YsSUFBSSxTQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNsRyxJQUFJLFNBQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRTNGLElBQUksSUFBSSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLE1BQUksR0FBRyxJQUFJLEdBQUcsOEJBQThCLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUNoRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLEtBQUksQ0FBQyxXQUFXLEdBQUcsU0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25JLElBQUksV0FBVyxHQUFHO3dCQUNoQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQzt3QkFDNUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLO3dCQUNmLE9BQU8sRUFBRSxRQUFRLENBQUMsNkJBQTZCO3dCQUMvQyxJQUFJLEVBQUUsU0FBTyxHQUFHLEtBQUksQ0FBQyxXQUFXLEdBQUcsU0FBTzt3QkFDeEMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxlQUFlO3FCQUMvQyxDQUFDO29CQUNGLElBQUksZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQzVDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUVsRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxTQUFTO3dCQUNwRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3RCLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sS0FBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDOzRCQUU5QyxLQUFJLENBQUMsV0FBVyxHQUFHLFNBQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUVuSSxJQUFJLFdBQVcsR0FBRztnQ0FDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7Z0NBQzVDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSztnQ0FDZixPQUFPLEVBQUUsUUFBUSxDQUFDLDZCQUE2QjtnQ0FDL0MsSUFBSSxFQUFFLFNBQU8sR0FBRyxLQUFJLENBQUMsV0FBVyxHQUFHLFNBQU87Z0NBQ3hDLFdBQVcsRUFBRSxlQUFlLENBQUMsZUFBZTs2QkFDL0MsQ0FBQzs0QkFDRixJQUFJLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDOzRCQUM1QyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFFbEQsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRU4sUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFHRCxnREFBMEIsR0FBMUIsVUFBMkIsS0FBVSxFQUFFLFFBQTJDO1FBQ2hGLElBQUksS0FBSyxHQUFHLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ2hFLElBQUksVUFBVSxHQUFHLEVBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNqRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUVWLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVqRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRU4sSUFBSSxJQUFJLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQzNDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyw2QkFBNkIsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUMscUJBQXFCLENBQUM7Z0JBQ3JHLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDM0YsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzNGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUVsRCxJQUFJLFdBQVcsR0FBRztvQkFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7b0JBQzVDLEVBQUUsRUFBRSxLQUFLLENBQUMsU0FBUztvQkFDbkIsT0FBTyxFQUFFLFFBQVEsQ0FBQyw0QkFBNEI7b0JBQzlDLElBQUksRUFBRSxPQUFPLEdBQUcsV0FBVyxHQUFHLE9BQU87b0JBRW5DLFdBQVcsRUFBRSxlQUFlLENBQUMsZUFBZTtpQkFDL0MsQ0FBQztnQkFDRixJQUFJLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO2dCQUM1QyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVsRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QsMENBQW9CLEdBQXBCLFVBQXFCLEtBQVUsRUFBRSxRQUEyQztRQUE1RSxpQkFpQ0M7UUEvQkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBQyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDNUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsU0FBUztvQkFDcEcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN0QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLEtBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQzt3QkFFOUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQzt3QkFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQzNDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRywrQkFBK0IsR0FBRyxLQUFLLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsZUFBZSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUM7d0JBQ3ZILElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDM0YsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyx1REFBdUQsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUNsRyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQzNGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNsRCxJQUFJLFdBQVcsR0FBRzs0QkFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7NEJBQzVDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSzs0QkFDZixPQUFPLEVBQUUsUUFBUSxDQUFDLDBCQUEwQjs0QkFDNUMsSUFBSSxFQUFFLE9BQU8sR0FBRyxXQUFXLEdBQUcsT0FBTzs0QkFDbkMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxlQUFlO3lCQUMvQyxDQUFDO3dCQUNGLElBQUksZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7d0JBQzVDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNsRCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbURBQTZCLEdBQTdCLFVBQThCLEtBQVUsRUFBRSxRQUEyQztRQUVuRixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUM1RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksSUFBSSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsNkJBQTZCLEdBQUcsS0FBSyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUMvRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGdEQUFnRCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzNGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsdURBQXVELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbEcsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMzRixJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxXQUFXLEdBQUc7b0JBQ2hCLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDO29CQUM1QyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLFFBQVEsQ0FBQywwQkFBMEI7b0JBQzVDLElBQUksRUFBRSxPQUFPLEdBQUcsV0FBVyxHQUFHLE9BQU87b0JBQ25DLFdBQVcsRUFBRSxlQUFlLENBQUMsZUFBZTtpQkFDL0MsQ0FBQztnQkFDRixJQUFJLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO2dCQUM1QyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUVsRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRU4sUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzlELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCw4QkFBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLHVEQUF1RCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEcsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4SSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDL0MsSUFBSSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7WUFDNUMsRUFBRSxFQUFFLEVBQUU7WUFDTixPQUFPLEVBQUUsUUFBUSxDQUFDLGdDQUFnQztZQUNsRCxJQUFJLEVBQUUsT0FBTyxHQUFHLFdBQVcsR0FBRyxPQUFPO1lBQ25DLFdBQVcsRUFBRSxlQUFlLENBQUMsZUFBZTtTQUMvQyxDQUFDO1FBQ0YsSUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM1QyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVsRCxDQUFDO0lBRUQscUNBQWUsR0FBZixVQUFnQixTQUFjLEVBQUUsUUFBMkM7UUFDekUsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzNGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLG1EQUFtRCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUYsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN04sRUFBRSxDQUFBLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsV0FBVyxHQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQztZQUN6QixXQUFXLEdBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFDRCxJQUFJLFdBQVcsR0FBRztZQUNoQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQztZQUM1QyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQztZQUN6QyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztZQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLDBCQUEwQixHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO1lBQ3ZGLElBQUksRUFBRSxPQUFPLEdBQUcsV0FBVyxHQUFHLE9BQU87WUFDbkMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxlQUFlO1NBQy9DLENBQUM7UUFDRixJQUFJLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzVDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRWxELENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsRUFBTyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsOEJBQVEsR0FBUixVQUFTLEtBQVUsRUFBRSxRQUEyQztRQUM5RCxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHVDQUFpQixHQUFqQixVQUFrQixLQUFVLEVBQUUsUUFBYyxFQUFFLFFBQTJDO1FBQ3ZGLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxzQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBVSxFQUFFLFFBQTJDO1FBQ3RFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsaUNBQVcsR0FBWCxVQUFZLElBQVMsRUFBRSxRQUEyQztRQUNoRSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUMxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsb0NBQW9DLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVGLDRCQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsSUFBUyxFQUFFLFFBQTJDO1FBQTFFLGlCQVVDO1FBUkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFVBQUMsR0FBUSxFQUFFLEdBQVE7WUFFbkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFBQSxJQUFJLENBQUMsQ0FBQztnQkFDTCxLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QsNEJBQU0sR0FBTixVQUFPLEdBQVcsRUFBRSxRQUEyQztRQUM3RCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELHNDQUFnQixHQUFoQixVQUFpQixLQUFVLEVBQUUsT0FBWSxFQUFFLE9BQVksRUFBRSxRQUEyQztRQUNsRyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksUUFBYSxFQUFFLFFBQWEsRUFBRSxFQUFPO1FBQy9DLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFHO1lBQzNDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQscUNBQWUsR0FBZixVQUFnQixRQUFhLEVBQUUsUUFBYSxFQUFFLEVBQU87UUFDbkQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVE7WUFDaEQsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwrQ0FBeUIsR0FBekIsVUFBMEIsS0FBVSxFQUFFLE9BQVksRUFBRSxPQUFZLEVBQUUsUUFBMkM7UUFDM0csSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsMkNBQXFCLEdBQXJCLFVBQXNCLEtBQVUsRUFBRSxVQUFjLEVBQUUsWUFBaUIsRUFBRSxRQUEyQztRQUM5RyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFSCxrQkFBQztBQUFELENBNVdBLEFBNFdDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pCLGlCQUFTLFdBQVcsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL3VzZXIuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xyXG5pbXBvcnQgU2VuZE1lc3NhZ2VTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWVzc2FnZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuXHJcbmNsYXNzIFVzZXJTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIG1pZF9jb250ZW50OiBhbnk7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVVzZXIoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBpdGVtLmVtYWlsfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZXJyKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH07XHJcblxyXG5cclxuICBnZW5lcmF0ZU90cChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnbW9iaWxlX251bWJlcic6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfSwgKGVyciwgcmVzKSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgKHJlc1swXS5faWQpICE9PSBmaWVsZC5faWQpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGZpZWxkLl9pZH07XHJcbiAgICAgICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xyXG4gICAgICAgIC8vIHZhciBvdHAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAwMDAgLSAxMDAwKSArIDEwMDApO1xyXG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdvdHAnOiBvdHB9O1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgIG90cDogb3RwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZURpcmVjdChEYXRhLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZU1vYmlsZU51bWJlcihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBmaWVsZC5faWR9O1xyXG4gICAgLy8gdmFyIG90cCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMCAtIDEwMDApICsgMTAwMCk7XHJcbiAgICBsZXQgb3RwID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnb3RwJzogb3RwLCAndGVtcF9tb2JpbGUnOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlcn07XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgRGF0YSA9IHtcclxuICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogZmllbGQuY3VycmVudF9tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgb3RwOiBvdHBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgc2VuZE1lc3NhZ2VTZXJ2aWNlLnNlbmRDaGFuZ2VNb2JpbGVNZXNzYWdlKERhdGEsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZvcmdvdFBhc3N3b3JkKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBmaWVsZC5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgcmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9oZWFkZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9yZ290cGFzc3dvcmQuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdyZXNldF9wYXNzd29yZD9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc1swXS5faWQ7XHJcbiAgICAgICAgaWYgKHJlc1swXS5pc0NhbmRpZGF0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5taWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGxpbmskJywgbGluaykucmVwbGFjZSgnJGZpcnN0X25hbWUkJywgcmVzWzBdLmZpcnN0X25hbWUpLnJlcGxhY2UoJyRhcHBfbmFtZSQnLCB0aGlzLkFQUF9OQU1FKTtcclxuICAgICAgICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgICAgICAgIHRvOiBmaWVsZC5lbWFpbCxcclxuICAgICAgICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9GT1JHT1RfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgIGh0bWw6IGhlYWRlcjEgKyB0aGlzLm1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAgICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc1swXS5faWQpfSwgKGVyciwgcmVjcnVpdGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMuY29tcGFueV9uYW1lID0gcmVjcnVpdGVyWzBdLmNvbXBhbnlfbmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5taWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGxpbmskJywgbGluaykucmVwbGFjZSgnJGZpcnN0X25hbWUkJywgdGhpcy5jb21wYW55X25hbWUpLnJlcGxhY2UoJyRhcHBfbmFtZSQnLCB0aGlzLkFQUF9OQU1FKTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgICAgICAgICAgICB0bzogZmllbGQuZW1haWwsXHJcbiAgICAgICAgICAgICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0ZPUkdPVF9QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgIGh0bWw6IGhlYWRlcjEgKyB0aGlzLm1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAgICAgICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiByZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyksIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IGZpZWxkLmN1cnJlbnRfZW1haWwsICdpc0FjdGl2YXRlZCc6IHRydWV9O1xyXG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J3RlbXBfZW1haWwnOiBmaWVsZC5uZXdfZW1haWx9O1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfRU1BSUxfQUNUSVZFX05PVyksIG51bGwpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKTtcclxuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAnYWN0aXZhdGVfdXNlcj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc3VsdC5faWQrJ2lzRW1haWxWZXJpZmljYXRpb24nO1xyXG4gICAgICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2NoYW5nZS5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgbWlkX2NvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJyRsaW5rJCcsIGxpbmspO1xyXG5cclxuICAgICAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgICAgIHRvOiBmaWVsZC5uZXdfZW1haWwsXHJcbiAgICAgICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NIQU5HRV9FTUFJTElELFxyXG4gICAgICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG5cclxuICAgICAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kVmVyaWZpY2F0aW9uTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J2VtYWlsJzogZmllbGQuZW1haWx9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc1swXS5faWQpfSwgKGVyciwgcmVjcnVpdGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBhbnlfbmFtZSA9IHJlY3J1aXRlclswXS5jb21wYW55X25hbWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZWNydWl0ZXJbMF0pO1xyXG4gICAgICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0Jyk7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gaG9zdCArICdjb21wYW55X2RldGFpbHM/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkICsgJyZjb21wYW55TmFtZT0nICsgdGhpcy5jb21wYW55X25hbWU7XHJcbiAgICAgICAgICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9yZWNydWl0ZXIubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsZXQgbWlkX2NvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJyRsaW5rJCcsIGxpbmspO1xyXG4gICAgICAgICAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgICAgICAgICAgdG86IGZpZWxkLmVtYWlsLFxyXG4gICAgICAgICAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgICAgIGh0bWw6IGhlYWRlcjEgKyBtaWRfY29udGVudCArIGZvb3RlcjFcclxuICAgICAgICAgICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRSZWNydWl0ZXJWZXJpZmljYXRpb25NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBmaWVsZC5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdhY3RpdmF0ZV91c2VyP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzWzBdLl9pZDtcclxuICAgICAgICBsZXQgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9yZWNydWl0ZXIubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2Zvb3RlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckbGluayQnLCBsaW5rKTtcclxuICAgICAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgICAgIHRvOiBmaWVsZC5lbWFpbCxcclxuICAgICAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2NvbnRhY3R1cy5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckZmlyc3RfbmFtZSQnLCBmaWVsZC5maXJzdF9uYW1lKS5yZXBsYWNlKCckZW1haWwkJywgZmllbGQuZW1haWwpLnJlcGxhY2UoJyRtZXNzYWdlJCcsIGZpZWxkLm1lc3NhZ2UpO1xyXG4gICAgbGV0IHRvID0gY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLkFETUlOX01BSUwnKTtcclxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHRvOiB0byxcclxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9VU0VSX0NPTlRBQ1RFRF9ZT1UsXHJcbiAgICAgIGh0bWw6IGhlYWRlcjEgKyBtaWRfY29udGVudCArIGZvb3RlcjFcclxuICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgfTtcclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgfVxyXG5cclxuICBzZW5kTWFpbE9uRXJyb3IoZXJyb3JJbmZvOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBjdXJyZW50X1RpbWUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwge2hvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCd9KTtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZXJyb3IubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJHRpbWUkJywgY3VycmVudF9UaW1lKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKS5yZXBsYWNlKCckcmVhc29uJCcsIGVycm9ySW5mby5yZWFzb24pLnJlcGxhY2UoJyRjb2RlJCcsIGVycm9ySW5mby5jb2RlKS5yZXBsYWNlKCckbWVzc2FnZSQnLCBlcnJvckluZm8ubWVzc2FnZSk7XHJcbiAgICBpZihlcnJvckluZm8uc3RhY2tUcmFjZSkge1xyXG4gICAgICBtaWRfY29udGVudD1taWRfY29udGVudC5yZXBsYWNlKCckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tUcmFjZS5zdGFjayk7XHJcbiAgICB9IGVsc2UgaWYoZXJyb3JJbmZvLnN0YWNrKXtcclxuICAgICAgbWlkX2NvbnRlbnQ9bWlkX2NvbnRlbnQucmVwbGFjZSgnJGVycm9yJCcsZXJyb3JJbmZvLnN0YWNrKTtcclxuICAgIH1cclxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHRvOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQURNSU5fTUFJTCcpLFxyXG4gICAgICBjYzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLlRQTEdST1VQX01BSUwnKSxcclxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9TRVJWRVJfRVJST1IgKyAnIG9uICcgKyBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpLFxyXG4gICAgICBodG1sOiBoZWFkZXIxICsgbWlkX2NvbnRlbnQgKyBmb290ZXIxXHJcbiAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgIH07XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH1cclxuXHJcbiAgZmluZEJ5SWQoaWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGZpZWxkLHt9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVdpdGhMaW1pdChmaWVsZDogYW55LCBpbmNsdWRlZCA6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGxpbWl0ID0gY29uZmlnLmdldCgnVHBsU2VlZC5saW1pdEZvclF1ZXJ5Jyk7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExpbWl0KGZpZWxkLCBpbmNsdWRlZCwgbGltaXQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlV2l0aExlYW4oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShmaWVsZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVBbGwoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHVwZGF0ZShfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGRlbGV0ZShfaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5kZWxldGUoX2lkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kT25lQW5kVXBkYXRlKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIFVwbG9hZEltYWdlKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcclxuICAgIGxldCB0YXJnZXRwYXRoID0gZmlsZU5hbWU7XHJcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBVcGxvYWREb2N1bWVudHModGVtcFBhdGg6IGFueSwgZmlsZU5hbWU6IGFueSwgY2I6IGFueSkge1xyXG4gICAgbGV0IHRhcmdldHBhdGggPSBmaWxlTmFtZTtcclxuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGNiKG51bGwsIHRlbXBQYXRoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnk6IGFueSwgcHJvamVjdGlvbjphbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeSwgcHJvamVjdGlvbiwgc29ydGluZ1F1ZXJ5LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoVXNlclNlcnZpY2UpO1xyXG5leHBvcnQgPSBVc2VyU2VydmljZTtcclxuIl19
