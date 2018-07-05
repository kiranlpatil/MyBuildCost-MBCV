"use strict";
var passport = require("passport");
var jwt = require("jwt-simple");
var Bearer = require("passport-http-bearer");
var sharedconstants_1 = require("../shared/sharedconstants");
var BearerStrategy = Bearer.Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var UserRepository = require("../dataaccess/repository/UserRepository");
var Messages = require("../shared/messages");
var GooglePlusTokenStrategy = require('passport-google-plus-token');
var config = require('config');
var AuthInterceptor = (function () {
    function AuthInterceptor() {
        var fbClientId = config.get('application.facebookIds.clientId');
        var fbClientSecretId = config.get('application.facebookIds.clientSecretId');
        var googlePlusClientId = config.get('application.googlePlusIds.clientId');
        var googlePlusClientSecretId = config.get('application.googlePlusIds.clientSecretId');
        passport.use(new BearerStrategy(function (token, done) {
            var decoded = null;
            var isShareApi = false;
            try {
                decoded = jwt.decode(token, sharedconstants_1.ConstVariables.AUTHENTICATION_JWT_KEY);
            }
            catch (e) {
                var err = new Error();
                err.message = Messages.MSG_ERROR_INVALID_TOKEN;
                return done(err, false, null);
            }
            if (decoded.shareKey === sharedconstants_1.ConstVariables.AUTHENTICATION_ENCODED_SHARE_KEY) {
                isShareApi = true;
            }
            else {
                if (decoded.exp === undefined) {
                    console.log('its an unsubscribed call in AuthInterceptor');
                }
                else if (decoded.exp <= Date.now()) {
                    var err = new Error();
                    err.message = Messages.MSG_ERROR_TOKEN_SESSION;
                    return done(err, false, null);
                }
            }
            if (decoded.iss !== undefined) {
                var userRepository = new UserRepository();
                userRepository.findById(decoded.iss, function (err, user) {
                    if (err) {
                        return done(err, null, null);
                    }
                    if (!user) {
                        return done(null, false, null);
                    }
                    return done(null, user, isShareApi);
                });
            }
        }));
        passport.use(new FacebookTokenStrategy({
            clientID: fbClientId,
            clientSecret: fbClientSecretId
        }, function (access_token, refresh_token, profile, done) {
            process.nextTick(function () {
                var userRepository = new UserRepository();
                var query = { 'email': profile.emails[0].value };
                userRepository.retrieve(query, function (err, user) {
                    if (err) {
                        return done(err, null);
                    }
                    if (user.length > 0) {
                        return done(null, user[0]);
                    }
                    else {
                        if (profile.emails[0].value) {
                            var newUser = {};
                            newUser.first_name = profile.name.givenName;
                            newUser.last_name = profile.name.familyName;
                            newUser.email = profile.emails[0].value;
                            newUser.mobile_number = 12345678;
                            newUser.password = '12345678';
                            newUser.current_theme = 'container-fluid light-theme';
                            var userRepository_1 = new UserRepository();
                            userRepository_1.create(newUser, function (err, res) {
                                if (err) {
                                    return done(err, null);
                                }
                                else {
                                    return done(null, res);
                                }
                            });
                        }
                        else {
                            return done(null, null, true);
                        }
                    }
                });
            });
        }));
        passport.use(new GooglePlusTokenStrategy({
            clientID: googlePlusClientId,
            clientSecret: googlePlusClientSecretId,
        }, function (req, access_token, refresh_token, profile, done) {
            process.nextTick(function () {
                var userRepository = new UserRepository();
                var query = { 'email': profile.emails[0].value };
                userRepository.retrieve(query, function (err, user) {
                    if (err) {
                        return done(err, null);
                    }
                    if (user.length > 0) {
                        return done(null, user[0]);
                    }
                    else {
                        if (profile.emails[0].value) {
                            var newUser = {};
                            var randomMobileNumber = Math.floor(Math.random() * (10000000000 - 100000) + 1000000000);
                            newUser.first_name = profile.name.givenName;
                            newUser.last_name = profile.name.familyName;
                            newUser.email = profile.emails[0].value;
                            newUser.mobile_number = randomMobileNumber;
                            newUser.password = 'YH8n@4Sjj!tYk4q-';
                            var userRepository_2 = new UserRepository();
                            userRepository_2.create(newUser, function (err, res) {
                                if (err) {
                                    return done(err, null);
                                }
                                else {
                                    return done(null, res);
                                }
                            });
                        }
                        else {
                            return done(null, null, true);
                        }
                    }
                });
            });
        }));
    }
    AuthInterceptor.prototype.issueTokenWithUid = function (user, role) {
        var issuer;
        if (user.userId) {
            issuer = user.userId;
        }
        else {
            issuer = user._id;
        }
        var curDate = new Date();
        var expires = new Date(curDate.getTime() + (60 * 24 * 60 * 60 * 1000));
        var token = jwt.encode({
            iss: issuer,
            exp: expires.getTime(),
            role: role
        }, sharedconstants_1.ConstVariables.AUTHENTICATION_JWT_KEY);
        return token;
    };
    AuthInterceptor.prototype.issueTokenWithUidForShare = function (user) {
        var issuer;
        var customKey = sharedconstants_1.ConstVariables.AUTHENTICATION_ENCODED_SHARE_KEY;
        if (user.userId) {
            issuer = user.userId;
        }
        else {
            issuer = user._id;
        }
        var token = jwt.encode({
            iss: issuer,
            shareKey: customKey
        }, sharedconstants_1.ConstVariables.AUTHENTICATION_JWT_KEY);
        return token;
    };
    AuthInterceptor.prototype.requiresAuth = function (req, res, next) {
        passport.authenticate('bearer', { session: false }, function (err, myuser, isShareApi) {
            if (err) {
                next({
                    reason: err.message,
                    message: err.message,
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                if (req.headers.authorization) {
                    if (req.headers.authorization.split(' ')[0].toLowerCase() !== 'bearer' || req.headers.authorization.split(' ').length !== 2) {
                        next({
                            reason: Messages.MSG_ERROR_IS_BEARER,
                            message: Messages.MSG_ERROR_IS_BEARER,
                            stackTrace: new Error(),
                            code: 401
                        });
                    }
                    else {
                        if (!myuser) {
                            next({
                                reason: Messages.MSG_ERROR_INVALID_TOKEN_2,
                                message: Messages.MSG_ERROR_INVALID_TOKEN_2,
                                stackTrace: new Error(),
                                code: 401
                            });
                        }
                        else {
                            req.user = myuser;
                            (isShareApi) ? req.isShareApi = true : req.isShareApi = false;
                            next();
                        }
                    }
                }
                else {
                    next({
                        reason: Messages.MSG_ERROR_TOKEN_NOT_PROVIDED,
                        message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
            }
        })(req, res, next);
    };
    AuthInterceptor.prototype.facebookAuth = function (req, res, next) {
        passport.authenticate('facebook-token', { scope: ['email'] }, function (err, user, info) {
            if (err) {
                next(err);
            }
            else if (info) {
                next({
                    reason: Messages.MSG_ERROR_FACEBOOK_AUTH,
                    message: Messages.MSG_ERROR_RSN_NOT_ALLOW,
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else if (user) {
                req.user = { 'email': user.email, 'password': user.password };
                next();
            }
            else {
                next({
                    reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                    message: Messages.MSG_ERROR_FACEBOOK_AUTH,
                    stackTrace: new Error(),
                    code: 401
                });
            }
        })(req, res, next);
    };
    AuthInterceptor.prototype.googleAuth = function (req, res, next) {
        var request = require('request');
        request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.googleToken, function (error, response, body) {
            if (error) {
                if (error.code === 'ETIMEDOUT') {
                    next({
                        reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                        message: Messages.MSG_ERROR_CONNECTION_TIMEOUT,
                        stackTrace: new Error(),
                        code: 401
                    });
                }
            }
            else if (response) {
                if (!error && response.statusCode === 200) {
                    var goolePlusObject_1 = JSON.parse(body);
                    var userRepository = new UserRepository();
                    var query = { 'email': goolePlusObject_1.email };
                    userRepository.retrieve(query, function (err, user) {
                        if (err) {
                            next(err);
                        }
                        else if (user.length > 0) {
                            if (user[0].social_profile_picture) {
                                req.user = { 'email': user[0].email, 'password': user[0].password };
                                next();
                            }
                            else {
                                var query_1 = { 'email': user[0].email };
                                var updateData = { 'social_profile_picture': goolePlusObject_1.picture };
                                var userRepository_3 = new UserRepository();
                                userRepository_3.findOneAndUpdate(query_1, updateData, { new: true }, function (error, result) {
                                    if (error) {
                                        next(error);
                                    }
                                    else {
                                        req.user = { 'email': user[0].email, 'password': user[0].password };
                                        next();
                                    }
                                });
                            }
                        }
                        else if (user.length === 0) {
                            var newUser = {};
                            var randomMobileNumber = Math.floor((Math.random() * 99999) + 100000);
                            newUser.first_name = goolePlusObject_1.given_name;
                            newUser.last_name = goolePlusObject_1.family_name;
                            newUser.email = goolePlusObject_1.email;
                            newUser.mobile_number = randomMobileNumber;
                            newUser.password = 'YH8n@4Sjj!tYk4q-';
                            newUser.current_theme = 'container-fluid light-theme';
                            newUser.social_profile_picture = goolePlusObject_1.picture;
                            newUser.isActivated = true;
                            var userRepository_4 = new UserRepository();
                            userRepository_4.create(newUser, function (err, res) {
                                if (err) {
                                    next(err);
                                }
                                else if (res) {
                                    req.user = { 'email': res.email, 'password': res.password };
                                    next();
                                }
                            });
                        }
                    });
                }
            }
        });
    };
    AuthInterceptor.prototype.secureApiCheck = function (req, res, next) {
        if (req.isShareApi) {
            next({
                reason: Messages.MSG_ERROR_API_CHECK,
                message: Messages.MSG_ERROR_API_CHECK,
                stackTrace: new Error(),
                code: 401
            });
        }
        else {
            next();
        }
    };
    AuthInterceptor.prototype.validateAdmin = function (req, res, next) {
        if (req.user.isAdmin) {
            next();
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
            });
        }
    };
    return AuthInterceptor;
}());
Object.seal(AuthInterceptor);
module.exports = AuthInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXFDO0FBQ3JDLGdDQUFrQztBQUNsQyw2Q0FBK0M7QUFDL0MsNkRBQXlEO0FBQ3pELElBQUksY0FBYyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvRCx3RUFBMkU7QUFDM0UsNkNBQThDO0FBRzlDLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBRUU7UUFFRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDNUUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDMUUsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFHdEYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQVUsRUFBRSxJQUFTO1lBQzdELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBWSxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxL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O0lBQ0gsQ0FBQztJQUVELHVDQUFhLEdBQWIsVUFBYyxHQUFRLEVBQUUsR0FBUSxFQUFFLElBQVM7UUFDekMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDO2dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDN0MsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQWhXQSxBQWdXQyxJQUFBO0FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM3QixpQkFBUyxlQUFlLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xyXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnand0LXNpbXBsZSc7XHJcbmltcG9ydCAqIGFzIEJlYXJlciBmcm9tICdwYXNzcG9ydC1odHRwLWJlYXJlcic7XHJcbmltcG9ydCB7Q29uc3RWYXJpYWJsZXN9IGZyb20gJy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHMnO1xyXG5sZXQgQmVhcmVyU3RyYXRlZ3k6IGFueSA9IEJlYXJlci5TdHJhdGVneTtcclxubGV0IEZhY2Vib29rVG9rZW5TdHJhdGVneSA9IHJlcXVpcmUoJ3Bhc3Nwb3J0LWZhY2Vib29rLXRva2VuJyk7XHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Vc2VyUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgTWVzc2FnZXM9cmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1VzZXJNb2RlbCcpO1xyXG5cclxubGV0IEdvb2dsZVBsdXNUb2tlblN0cmF0ZWd5ID0gcmVxdWlyZSgncGFzc3BvcnQtZ29vZ2xlLXBsdXMtdG9rZW4nKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxuY2xhc3MgQXV0aEludGVyY2VwdG9yIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgbGV0IGZiQ2xpZW50SWQgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5mYWNlYm9va0lkcy5jbGllbnRJZCcpO1xyXG4gICAgbGV0IGZiQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5mYWNlYm9va0lkcy5jbGllbnRTZWNyZXRJZCcpO1xyXG4gICAgbGV0IGdvb2dsZVBsdXNDbGllbnRJZCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLmdvb2dsZVBsdXNJZHMuY2xpZW50SWQnKTtcclxuICAgIGxldCBnb29nbGVQbHVzQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5nb29nbGVQbHVzSWRzLmNsaWVudFNlY3JldElkJyk7XHJcblxyXG5cclxuICAgIHBhc3Nwb3J0LnVzZShuZXcgQmVhcmVyU3RyYXRlZ3koZnVuY3Rpb24gKHRva2VuOiBhbnksIGRvbmU6IGFueSkge1xyXG4gICAgICBsZXQgZGVjb2RlZDogYW55ID0gbnVsbDtcclxuICAgICAgbGV0IGlzU2hhcmVBcGk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBkZWNvZGVkID0gand0LmRlY29kZSh0b2tlbiwgQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fSldUX0tFWSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBsZXQgZXJyID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgZXJyLm1lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9UT0tFTjtcclxuICAgICAgICByZXR1cm4gZG9uZShlcnIsIGZhbHNlLCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGVjb2RlZC5zaGFyZUtleSA9PT0gQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fRU5DT0RFRF9TSEFSRV9LRVkpIHtcclxuICAgICAgICBpc1NoYXJlQXBpID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZGVjb2RlZC5leHAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2l0cyBhbiB1bnN1YnNjcmliZWQgY2FsbCBpbiBBdXRoSW50ZXJjZXB0b3InKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRlY29kZWQuZXhwIDw9IERhdGUubm93KCkpIHtcclxuICAgICAgICAgIGxldCBlcnIgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgIGVyci5tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1RPS0VOX1NFU1NJT047XHJcbiAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIGZhbHNlLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkZWNvZGVkLmlzcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgIHVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGRlY29kZWQuaXNzLCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlciwgaXNTaGFyZUFwaSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pKTtcclxuXHJcbiAgICBwYXNzcG9ydC51c2UobmV3IEZhY2Vib29rVG9rZW5TdHJhdGVneSh7XHJcbiAgICAgICAgY2xpZW50SUQ6IGZiQ2xpZW50SWQsXHJcbiAgICAgICAgY2xpZW50U2VjcmV0OiBmYkNsaWVudFNlY3JldElkXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBmYWNlYm9vayB3aWxsIHNlbmQgYmFjayB0aGUgdG9rZW5zIGFuZCBwcm9maWxlXHJcbiAgICAgIGZ1bmN0aW9uIChhY2Nlc3NfdG9rZW46IGFueSwgcmVmcmVzaF90b2tlbjogYW55LCBwcm9maWxlOiBhbnksIGRvbmU6IGFueSkge1xyXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy8gZmluZCB0aGUgdXNlciBpbiB0aGUgZGF0YWJhc2UgYmFzZWQgb24gdGhlaXIgZmFjZWJvb2sgaWRcclxuICAgICAgICAgIGxldCB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBwcm9maWxlLmVtYWlsc1swXS52YWx1ZX07XHJcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgZnVuY3Rpb24gKGVyciwgdXNlcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cclxuICAgICAgICAgICAgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyWzBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB1c2VyIGZvdW5kIHdpdGggdGhhdCBmYWNlYm9vayBpZCwgY3JlYXRlIHRoZW1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3VXNlcjogYW55ID0gPFVzZXJNb2RlbD57fTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSBwcm9maWxlLm5hbWUuZ2l2ZW5OYW1lO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5sYXN0X25hbWUgPSBwcm9maWxlLm5hbWUuZmFtaWx5TmFtZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IDEyMzQ1Njc4O1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5wYXNzd29yZCA9ICcxMjM0NTY3OCc7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmN1cnJlbnRfdGhlbWUgPSAnY29udGFpbmVyLWZsdWlkIGxpZ2h0LXRoZW1lJztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzYXZlIG91ciB1c2VyIHRvIHRoZSBkYXRhYmFzZVxyXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuY3JlYXRlKG5ld1VzZXIsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pKTtcclxuXHJcbiAgICBwYXNzcG9ydC51c2UobmV3IEdvb2dsZVBsdXNUb2tlblN0cmF0ZWd5KHtcclxuICAgICAgICBjbGllbnRJRDogZ29vZ2xlUGx1c0NsaWVudElkLFxyXG4gICAgICAgIGNsaWVudFNlY3JldDogZ29vZ2xlUGx1c0NsaWVudFNlY3JldElkLFxyXG4gICAgICAgIC8vIHBhc3NSZXFUb0NhbGxiYWNrOiB0cnVlXHJcblxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gR29vZ2xlIHdpbGwgc2VuZCBiYWNrIHRoZSB0b2tlbnMgYW5kIHByb2ZpbGVcclxuICAgICAgZnVuY3Rpb24gKHJlcTogYW55LCBhY2Nlc3NfdG9rZW46IGFueSwgcmVmcmVzaF90b2tlbjogYW55LCBwcm9maWxlOiBhbnksIGRvbmU6IGFueSkge1xyXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy8gZmluZCB0aGUgdXNlciBpbiB0aGUgZGF0YWJhc2UgYmFzZWQgb24gdGhlaXIgZmFjZWJvb2sgaWRcclxuICAgICAgICAgIGxldCB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBwcm9maWxlLmVtYWlsc1swXS52YWx1ZX07XHJcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgZnVuY3Rpb24gKGVyciwgdXNlcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cclxuICAgICAgICAgICAgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyWzBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB1c2VyIGZvdW5kIHdpdGggdGhhdCBnb29nbGUgaWQsIGNyZWF0ZSB0aGVtXHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcm9maWxlLmVtYWlsc1swXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XHJcbiAgICAgICAgICAgICAgICBsZXQgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMDAwMDAwIC0gMTAwMDAwKSArIDEwMDAwMDAwMDApO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5maXJzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmdpdmVuTmFtZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmZhbWlseU5hbWU7XHJcbiAgICAgICAgICAgICAgICAvL25ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IHJhbmRvbU1vYmlsZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnWUg4bkA0U2pqIXRZazRxLSc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBvdXIgdXNlciB0byB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgICAgICAgIGxldCB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICBpc3N1ZVRva2VuV2l0aFVpZCh1c2VyOiBhbnksIHJvbGU/OiBzdHJpbmcpIHtcclxuICAgIGxldCBpc3N1ZXI6IHN0cmluZztcclxuICAgIGlmICh1c2VyLnVzZXJJZCkge1xyXG4gICAgICBpc3N1ZXIgPSB1c2VyLnVzZXJJZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlzc3VlciA9IHVzZXIuX2lkO1xyXG4gICAgfVxyXG4gICAgbGV0IGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gZXhwaXJlcyBpbiA2MCBkYXlzXHJcbiAgICBsZXQgZXhwaXJlcyA9IG5ldyBEYXRlKGN1ckRhdGUuZ2V0VGltZSgpICsgKDYwICogMjQgKiA2MCAqIDYwICogMTAwMCkpOyAvLyhkYXkqaHIqbWluKnNlYyptaWxpc2VjKVxyXG4gICAgbGV0IHRva2VuID0gand0LmVuY29kZSh7XHJcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxyXG4gICAgICBleHA6IGV4cGlyZXMuZ2V0VGltZSgpLCAvLyBleHBpcmF0aW9uIHRpbWVcclxuICAgICAgcm9sZTogcm9sZVxyXG4gICAgfSwgQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fSldUX0tFWSk7XHJcbiAgICByZXR1cm4gdG9rZW47XHJcbiAgfVxyXG5cclxuICBpc3N1ZVRva2VuV2l0aFVpZEZvclNoYXJlKHVzZXI6IGFueSkge1xyXG4gICAgLy9Ub2tlbiB3aXRoIG5vIGV4cGlyeSBkYXRlXHJcbiAgICBsZXQgaXNzdWVyOiBzdHJpbmc7XHJcbiAgICBsZXQgY3VzdG9tS2V5OiBzdHJpbmcgPSBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9FTkNPREVEX1NIQVJFX0tFWTtcclxuICAgIGlmICh1c2VyLnVzZXJJZCkge1xyXG4gICAgICBpc3N1ZXIgPSB1c2VyLnVzZXJJZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlzc3VlciA9IHVzZXIuX2lkO1xyXG4gICAgfVxyXG4gICAgbGV0IHRva2VuID0gand0LmVuY29kZSh7XHJcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxyXG4gICAgICBzaGFyZUtleTogY3VzdG9tS2V5XHJcbiAgICB9LCBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9KV1RfS0VZKTtcclxuXHJcbiAgICByZXR1cm4gdG9rZW47XHJcbiAgfVxyXG5cclxuICByZXF1aXJlc0F1dGgocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnYmVhcmVyJywge3Nlc3Npb246IGZhbHNlfSxcclxuICAgICAgZnVuY3Rpb24gKGVycjogYW55LCBteXVzZXI6IGFueSwgaXNTaGFyZUFwaTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogZXJyLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicgfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JU19CRUFSRVIsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JU19CRUFSRVIsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmICghbXl1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX1RPS0VOXzIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU5fMixcclxuICAgICAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSBteXVzZXI7XHJcbiAgICAgICAgICAgICAgICAoaXNTaGFyZUFwaSkgPyByZXEuaXNTaGFyZUFwaSA9IHRydWUgOiByZXEuaXNTaGFyZUFwaSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1RPS0VOX05PVF9QUk9WSURFRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkocmVxLCByZXMsIG5leHQpO1xyXG4gIH1cclxuXHJcbiAgZmFjZWJvb2tBdXRoKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rLXRva2VuJywge3Njb3BlOiBbJ2VtYWlsJ119LFxyXG4gICAgICAoZXJyOiBhbnksIHVzZXI6IGFueSwgaW5mbzogYW55KSA9PiB7XHJcblxyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluZm8pIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUNFQk9PS19BVVRILFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX05PVF9BTExPVyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiB1c2VyLmVtYWlsLCAncGFzc3dvcmQnOiB1c2VyLnBhc3N3b3JkfTtcclxuICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRkFDRUJPT0tfQVVUSCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSkocmVxLCByZXMsIG5leHQpO1xyXG4gIH1cclxuXHJcbiAgZ29vZ2xlQXV0aChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgbGV0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcbiAgICByZXF1ZXN0KCdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjMvdG9rZW5pbmZvP2lkX3Rva2VuPScgKyByZXEuYm9keS5nb29nbGVUb2tlbiwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VUSU1FRE9VVCcpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NPTk5FQ1RJT05fVElNRU9VVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICBsZXQgZ29vbGVQbHVzT2JqZWN0ID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICAgIGxldCB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBnb29sZVBsdXNPYmplY3QuZW1haWx9O1xyXG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHVzZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICBpZiAodXNlclswXS5zb2NpYWxfcHJvZmlsZV9waWN0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiB1c2VyWzBdLmVtYWlsLCAncGFzc3dvcmQnOiB1c2VyWzBdLnBhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IHVzZXJbMF0uZW1haWx9O1xyXG4gICAgICAgICAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J3NvY2lhbF9wcm9maWxlX3BpY3R1cmUnOiBnb29sZVBsdXNPYmplY3QucGljdHVyZX07XHJcbiAgICAgICAgICAgICAgICBsZXQgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlclswXS5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlclswXS5wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICBsZXQgbmV3VXNlcjogYW55ID0gPFVzZXJNb2RlbD57fTtcclxuICAgICAgICAgICAgICBsZXQgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5maXJzdF9uYW1lID0gZ29vbGVQbHVzT2JqZWN0LmdpdmVuX25hbWU7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5sYXN0X25hbWUgPSBnb29sZVBsdXNPYmplY3QuZmFtaWx5X25hbWU7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5lbWFpbCA9IGdvb2xlUGx1c09iamVjdC5lbWFpbDtcclxuICAgICAgICAgICAgICBuZXdVc2VyLm1vYmlsZV9udW1iZXIgPSByYW5kb21Nb2JpbGVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5wYXNzd29yZCA9ICdZSDhuQDRTamohdFlrNHEtJztcclxuICAgICAgICAgICAgICBuZXdVc2VyLmN1cnJlbnRfdGhlbWUgPSAnY29udGFpbmVyLWZsdWlkIGxpZ2h0LXRoZW1lJztcclxuICAgICAgICAgICAgICBuZXdVc2VyLnNvY2lhbF9wcm9maWxlX3BpY3R1cmUgPSBnb29sZVBsdXNPYmplY3QucGljdHVyZTtcclxuICAgICAgICAgICAgICBuZXdVc2VyLmlzQWN0aXZhdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHJlcy5lbWFpbCwgJ3Bhc3N3b3JkJzogcmVzLnBhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VjdXJlQXBpQ2hlY2socmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIGlmIChyZXEuaXNTaGFyZUFwaSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9BUElfQ0hFQ0ssXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FQSV9DSEVDSyxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZUFkbWluKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBuZXh0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChBdXRoSW50ZXJjZXB0b3IpO1xyXG5leHBvcnQgPSBBdXRoSW50ZXJjZXB0b3I7XHJcbiJdfQ==
