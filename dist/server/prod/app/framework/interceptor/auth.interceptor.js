"use strict";
var passport = require("passport");
var jwt = require("jwt-simple");
var Bearer = require("passport-http-bearer");
var sharedconstants_1 = require("../shared/sharedconstants");
var BearerStrategy = Bearer.Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var UserRepository = require("../dataaccess/repository/user.repository");
var Messages = require("../shared/messages");
var GooglePlusTokenStrategy = require('passport-google-plus-token');
var config = require('config');
var AuthInterceptor = (function () {
    function AuthInterceptor() {
        var fbClientId = config.get('TplSeed.facebookIds.clientId');
        var fbClientSecretId = config.get('TplSeed.facebookIds.clientSecretId');
        var googlePlusClientId = config.get('TplSeed.googlePlusIds.clientId');
        var googlePlusClientSecretId = config.get('TplSeed.googlePlusIds.clientSecretId');
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
                var query = { "email": profile.emails[0].value };
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
                            var userRepository = new UserRepository();
                            userRepository.create(newUser, function (err, res) {
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
                var query = { "email": profile.emails[0].value };
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
                            var userRepository = new UserRepository();
                            userRepository.create(newUser, function (err, res) {
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
                if (error.code == "ETIMEDOUT") {
                    next({
                        reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                        message: Messages.MSG_ERROR_CONNECTION_TIMEOUT,
                        stackTrace: new Error(),
                        code: 401
                    });
                }
            }
            else if (response) {
                if (!error && response.statusCode == 200) {
                    var goolePlusObject = JSON.parse(body);
                    var userRepository = new UserRepository();
                    var query = { "email": goolePlusObject.email };
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
                                var query = { "email": user[0].email };
                                var updateData = { "social_profile_picture": goolePlusObject.picture };
                                var userRepository = new UserRepository();
                                userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
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
                            newUser.first_name = goolePlusObject.given_name;
                            newUser.last_name = goolePlusObject.family_name;
                            newUser.email = goolePlusObject.email;
                            newUser.mobile_number = randomMobileNumber;
                            newUser.password = 'YH8n@4Sjj!tYk4q-';
                            newUser.current_theme = 'container-fluid light-theme';
                            newUser.social_profile_picture = goolePlusObject.picture;
                            newUser.isActivated = true;
                            var userRepository = new UserRepository();
                            userRepository.create(newUser, function (err, res) {
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
    return AuthInterceptor;
}());
Object.seal(AuthInterceptor);
module.exports = AuthInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXFDO0FBQ3JDLGdDQUFrQztBQUNsQyw2Q0FBK0M7QUFDL0MsNkRBQTJEO0FBQzNELElBQUksY0FBYyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvRCx5RUFBNEU7QUFDNUUsNkNBQThDO0FBRzlDLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBRUU7UUFFRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdEUsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFHbEYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQVUsRUFBRSxJQUFTO1lBQzdELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxL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LENBQUMsQ0FBQztvQ0FDUixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ1osQ0FBQztnQ0FDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQ0FDYixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUMsQ0FBQztvQ0FDMUQsSUFBSSxFQUFFLENBQUM7Z0NBQ1QsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0NBQWMsR0FBZCxVQUFlLEdBQU8sRUFBRSxHQUFPLEVBQUUsSUFBUTtRQUN2QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUU7Z0JBQ0YsTUFBTSxFQUFFLFFBQVEsQ0FBQyxtQkFBbUI7Z0JBQ3BDLE9BQU8sRUFBRSxRQUFRLENBQUMsbUJBQW1CO2dCQUNyQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHO2FBQ1YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDO0lBQ0gsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0EvVkEsQUErVkMsSUFBQTtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhc3Nwb3J0IGZyb20gXCJwYXNzcG9ydFwiO1xyXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSBcImp3dC1zaW1wbGVcIjtcclxuaW1wb3J0ICogYXMgQmVhcmVyIGZyb20gXCJwYXNzcG9ydC1odHRwLWJlYXJlclwiO1xyXG5pbXBvcnQgeyBDb25zdFZhcmlhYmxlcyB9IGZyb20gXCIuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XHJcbnZhciBCZWFyZXJTdHJhdGVneTogYW55ID0gQmVhcmVyLlN0cmF0ZWd5O1xyXG52YXIgRmFjZWJvb2tUb2tlblN0cmF0ZWd5ID0gcmVxdWlyZSgncGFzc3BvcnQtZmFjZWJvb2stdG9rZW4nKTtcclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnlcIik7XHJcbmltcG9ydCBNZXNzYWdlcz1yZXF1aXJlKFwiLi4vc2hhcmVkL21lc3NhZ2VzXCIpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlci5tb2RlbFwiKTtcclxuXHJcbnZhciBHb29nbGVQbHVzVG9rZW5TdHJhdGVneSA9IHJlcXVpcmUoJ3Bhc3Nwb3J0LWdvb2dsZS1wbHVzLXRva2VuJyk7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxuXHJcbmNsYXNzIEF1dGhJbnRlcmNlcHRvciB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIHZhciBmYkNsaWVudElkID0gY29uZmlnLmdldCgnVHBsU2VlZC5mYWNlYm9va0lkcy5jbGllbnRJZCcpO1xyXG4gICAgdmFyIGZiQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZhY2Vib29rSWRzLmNsaWVudFNlY3JldElkJyk7XHJcbiAgICB2YXIgZ29vZ2xlUGx1c0NsaWVudElkID0gY29uZmlnLmdldCgnVHBsU2VlZC5nb29nbGVQbHVzSWRzLmNsaWVudElkJyk7XHJcbiAgICB2YXIgZ29vZ2xlUGx1c0NsaWVudFNlY3JldElkID0gY29uZmlnLmdldCgnVHBsU2VlZC5nb29nbGVQbHVzSWRzLmNsaWVudFNlY3JldElkJyk7XHJcblxyXG5cclxuICAgIHBhc3Nwb3J0LnVzZShuZXcgQmVhcmVyU3RyYXRlZ3koZnVuY3Rpb24gKHRva2VuOiBhbnksIGRvbmU6IGFueSkge1xyXG4gICAgICB2YXIgZGVjb2RlZDogYW55ID0gbnVsbDtcclxuICAgICAgdmFyIGlzU2hhcmVBcGk6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGRlY29kZWQgPSBqd3QuZGVjb2RlKHRva2VuLCBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9KV1RfS0VZKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICBlcnIubWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX1RPS0VOO1xyXG4gICAgICAgIHJldHVybiBkb25lKGVyciwgZmFsc2UsIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkZWNvZGVkLnNoYXJlS2V5ID09PSBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9FTkNPREVEX1NIQVJFX0tFWSkge1xyXG4gICAgICAgIGlzU2hhcmVBcGkgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkZWNvZGVkLmV4cCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaXRzIGFuIHVuc3Vic2NyaWJlZCBjYWxsIGluIEF1dGhJbnRlcmNlcHRvcicpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGVjb2RlZC5leHAgPD0gRGF0ZS5ub3coKSkge1xyXG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyLm1lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfRVJST1JfVE9LRU5fU0VTU0lPTjtcclxuICAgICAgICAgIHJldHVybiBkb25lKGVyciwgZmFsc2UsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoZGVjb2RlZC5pc3MgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICB1c2VyUmVwb3NpdG9yeS5maW5kQnlJZChkZWNvZGVkLmlzcywgZnVuY3Rpb24gKGVyciwgdXNlcikge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsbnVsbCxudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBmYWxzZSxudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHVzZXIsIGlzU2hhcmVBcGkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IC8qZWxzZSB7XHJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgIGVyci5tZXNzYWdlID0gJ0lzc3VlciBpbiB0b2tlbiBpcyBub3QgYXZhaWxhYmxlJztcclxuICAgICAgICByZXR1cm4gZG9uZShlcnIsIGZhbHNlLCBudWxsKTtcclxuICAgICAgfSovXHJcbiAgICB9KSk7XHJcblxyXG4gICAgcGFzc3BvcnQudXNlKG5ldyBGYWNlYm9va1Rva2VuU3RyYXRlZ3koe1xyXG4gICAgICAgIGNsaWVudElEOiBmYkNsaWVudElkLFxyXG4gICAgICAgIGNsaWVudFNlY3JldDogZmJDbGllbnRTZWNyZXRJZFxyXG4gICAgICAgIC8vY2FsbGJhY2tVUkwgICAgIDogICdodHRwOi8vbG9jYWxob3N0OjgwODAvZmJMb2dpbicsXHJcbiAgICAgICAgLy9wcm9maWxlRmllbGRzOiBbJ2lkJywnZW1haWxzJywgJ2Rpc3BsYXlOYW1lJ11cclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBmYWNlYm9vayB3aWxsIHNlbmQgYmFjayB0aGUgdG9rZW5zIGFuZCBwcm9maWxlXHJcbiAgICAgIGZ1bmN0aW9uIChhY2Nlc3NfdG9rZW46IGFueSwgcmVmcmVzaF90b2tlbjogYW55LCBwcm9maWxlOiBhbnksIGRvbmU6IGFueSkge1xyXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy8gZmluZCB0aGUgdXNlciBpbiB0aGUgZGF0YWJhc2UgYmFzZWQgb24gdGhlaXIgZmFjZWJvb2sgaWRcclxuICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgIHZhciBxdWVyeSA9IHtcImVtYWlsXCI6IHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlfTtcclxuICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyBmb3VuZCwgdGhlbiBsb2cgdGhlbSBpblxyXG4gICAgICAgICAgICBpZiAodXNlci5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHVzZXJbMF0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHVzZXIgZm91bmQgd2l0aCB0aGF0IGZhY2Vib29rIGlkLCBjcmVhdGUgdGhlbVxyXG5cclxuICAgICAgICAgICAgICBpZiAocHJvZmlsZS5lbWFpbHNbMF0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdVc2VyOiBhbnkgPSA8VXNlck1vZGVsPnt9O1xyXG5cclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5naXZlbk5hbWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmxhc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5mYW1pbHlOYW1lO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5lbWFpbCA9IHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5tb2JpbGVfbnVtYmVyID0gMTIzNDU2Nzg7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJzEyMzQ1Njc4JztcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuY3VycmVudF90aGVtZSA9ICdjb250YWluZXItZmx1aWQgbGlnaHQtdGhlbWUnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNhdmUgb3VyIHVzZXIgdG8gdGhlIGRhdGFiYXNlXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5jcmVhdGUobmV3VXNlciwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHBhc3Nwb3J0LnVzZShuZXcgR29vZ2xlUGx1c1Rva2VuU3RyYXRlZ3koe1xyXG4gICAgICAgIGNsaWVudElEOiBnb29nbGVQbHVzQ2xpZW50SWQsXHJcbiAgICAgICAgY2xpZW50U2VjcmV0OiBnb29nbGVQbHVzQ2xpZW50U2VjcmV0SWQsXHJcbiAgICAgICAgLy8gcGFzc1JlcVRvQ2FsbGJhY2s6IHRydWVcclxuXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBHb29nbGUgd2lsbCBzZW5kIGJhY2sgdGhlIHRva2VucyBhbmQgcHJvZmlsZVxyXG4gICAgICBmdW5jdGlvbiAocmVxOiBhbnksIGFjY2Vzc190b2tlbjogYW55LCByZWZyZXNoX3Rva2VuOiBhbnksIHByb2ZpbGU6IGFueSwgZG9uZTogYW55KSB7XHJcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvLyBmaW5kIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSBiYXNlZCBvbiB0aGVpciBmYWNlYm9vayBpZFxyXG4gICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogcHJvZmlsZS5lbWFpbHNbMF0udmFsdWV9O1xyXG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIGZ1bmN0aW9uIChlcnIsIHVzZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIGZvdW5kLCB0aGVuIGxvZyB0aGVtIGluXHJcbiAgICAgICAgICAgIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlclswXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gdXNlciBmb3VuZCB3aXRoIHRoYXQgZ29vZ2xlIGlkLCBjcmVhdGUgdGhlbVxyXG5cclxuICAgICAgICAgICAgICBpZiAocHJvZmlsZS5lbWFpbHNbMF0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdVc2VyOiBhbnkgPSA8VXNlck1vZGVsPnt9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbU1vYmlsZU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAwMDAwMCAtIDEwMDAwMCkgKyAxMDAwMDAwMDAwKTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5naXZlbk5hbWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmxhc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5mYW1pbHlOYW1lO1xyXG4gICAgICAgICAgICAgICAgLy9uZXdVc2VyLmVtYWlsID0gcHJvZmlsZS5lbWFpbHNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmVtYWlsID0gcHJvZmlsZS5lbWFpbHNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLm1vYmlsZV9udW1iZXIgPSByYW5kb21Nb2JpbGVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJ1lIOG5ANFNqaiF0WWs0cS0nO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNhdmUgb3VyIHVzZXIgdG8gdGhlIGRhdGFiYXNlXHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5jcmVhdGUobmV3VXNlciwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSkpO1xyXG4gIH1cclxuXHJcbiAgaXNzdWVUb2tlbldpdGhVaWQodXNlcjogYW55LHJvbGU/OnN0cmluZykge1xyXG4gICAgdmFyIGlzc3Vlcjogc3RyaW5nO1xyXG4gICAgaWYgKHVzZXIudXNlcklkKSB7XHJcbiAgICAgIGlzc3VlciA9IHVzZXIudXNlcklkO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXNzdWVyID0gdXNlci5faWQ7XHJcbiAgICB9XHJcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyBleHBpcmVzIGluIDYwIGRheXNcclxuICAgIHZhciBleHBpcmVzID0gbmV3IERhdGUoY3VyRGF0ZS5nZXRUaW1lKCkgKyAoNjAgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7IC8vKGRheSpociptaW4qc2VjKm1pbGlzZWMpXHJcbiAgICB2YXIgdG9rZW4gPSBqd3QuZW5jb2RlKHtcclxuICAgICAgaXNzOiBpc3N1ZXIsIC8vIGlzc3VlXHJcbiAgICAgIGV4cDogZXhwaXJlcy5nZXRUaW1lKCksIC8vIGV4cGlyYXRpb24gdGltZVxyXG4gICAgICByb2xlOiByb2xlXHJcbiAgICB9LCBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9KV1RfS0VZKTtcclxuICAgIHJldHVybiB0b2tlbjtcclxuICB9XHJcblxyXG4gIGlzc3VlVG9rZW5XaXRoVWlkRm9yU2hhcmUodXNlcjphbnkpIHtcclxuICAgIC8vVG9rZW4gd2l0aCBubyBleHBpcnkgZGF0ZVxyXG4gICAgdmFyIGlzc3VlcjpzdHJpbmc7XHJcbiAgICB2YXIgY3VzdG9tS2V5OnN0cmluZyA9IENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0VOQ09ERURfU0hBUkVfS0VZO1xyXG4gICAgaWYgKHVzZXIudXNlcklkKSB7XHJcbiAgICAgIGlzc3VlciA9IHVzZXIudXNlcklkO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXNzdWVyID0gdXNlci5faWQ7XHJcbiAgICB9XHJcbiAgICB2YXIgdG9rZW4gPSBqd3QuZW5jb2RlKHtcclxuICAgICAgaXNzOiBpc3N1ZXIsIC8vIGlzc3VlXHJcbiAgICAgIHNoYXJlS2V5OiBjdXN0b21LZXlcclxuICAgIH0sIENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0pXVF9LRVkpO1xyXG5cclxuICAgIHJldHVybiB0b2tlbjtcclxuICB9XHJcblxyXG4gIHJlcXVpcmVzQXV0aChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdiZWFyZXInLCB7c2Vzc2lvbjogZmFsc2V9LFxyXG4gICAgICBmdW5jdGlvbiAoZXJyOmFueSwgbXl1c2VyOmFueSwgaXNTaGFyZUFwaTpib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBlcnIubWVzc2FnZSxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBlcnIubWVzc2FnZSxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicgfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICBuZXh0KCB7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JU19CRUFSRVIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSVNfQkVBUkVSLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFteXVzZXIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9UT0tFTl8yLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9UT0tFTl8yLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVxLnVzZXIgPSBteXVzZXI7XHJcbiAgICAgICAgICAgICAgKGlzU2hhcmVBcGkpID8gcmVxLmlzU2hhcmVBcGkgPSB0cnVlIDogcmVxLmlzU2hhcmVBcGkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pKHJlcSwgcmVzLCBuZXh0KTtcclxuICB9XHJcblxyXG4gIGZhY2Vib29rQXV0aChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdmYWNlYm9vay10b2tlbicsIHtzY29wZTogWydlbWFpbCddfSxcclxuICAgICAgKGVycjogYW55LCB1c2VyOiBhbnksIGluZm86IGFueSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGluZm8pIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUNFQk9PS19BVVRILFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX05PVF9BTExPVyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXIpIHtcclxuICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHVzZXIuZW1haWwsICdwYXNzd29yZCc6IHVzZXIucGFzc3dvcmR9O1xyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0ZBQ0VCT09LX0FVVEgsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pKHJlcSwgcmVzLCBuZXh0KTtcclxuICB9XHJcblxyXG4gIGdvb2dsZUF1dGgocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG4gICAgcmVxdWVzdCgnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuaW5mbz9pZF90b2tlbj0nICsgcmVxLmJvZHkuZ29vZ2xlVG9rZW4sIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT0gXCJFVElNRURPVVRcIikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ09OTkVDVElPTl9USU1FT1VULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgdmFyIGdvb2xlUGx1c09iamVjdCA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiBnb29sZVBsdXNPYmplY3QuZW1haWx9O1xyXG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHVzZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyBmb3VuZCwgdGhlbiBsb2cgdGhlbSBpblxyXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICBpZiAodXNlclswXS5zb2NpYWxfcHJvZmlsZV9waWN0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiB1c2VyWzBdLmVtYWlsLCAncGFzc3dvcmQnOiB1c2VyWzBdLnBhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiB1c2VyWzBdLmVtYWlsfTtcclxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVEYXRhID0ge1wic29jaWFsX3Byb2ZpbGVfcGljdHVyZVwiOiBnb29sZVBsdXNPYmplY3QucGljdHVyZX07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9FTUFJTF9BQ1RJVkVfTk9XKSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlclswXS5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlclswXS5wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XHJcbiAgICAgICAgICAgICAgLy92YXIgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMDAwMDAwIC0gMTAwMDAwKSArIDEwMDAwMDAwMDApO1xyXG4gICAgICAgICAgICAgIHZhciByYW5kb21Nb2JpbGVOdW1iZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTkpICsgMTAwMDAwKTtcclxuICAgICAgICAgICAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSBnb29sZVBsdXNPYmplY3QuZ2l2ZW5fbmFtZTtcclxuICAgICAgICAgICAgICBuZXdVc2VyLmxhc3RfbmFtZSA9IGdvb2xlUGx1c09iamVjdC5mYW1pbHlfbmFtZTtcclxuICAgICAgICAgICAgICBuZXdVc2VyLmVtYWlsID0gZ29vbGVQbHVzT2JqZWN0LmVtYWlsO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IHJhbmRvbU1vYmlsZU51bWJlcjtcclxuICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJ1lIOG5ANFNqaiF0WWs0cS0nO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIuY3VycmVudF90aGVtZSA9ICdjb250YWluZXItZmx1aWQgbGlnaHQtdGhlbWUnO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSA9IGdvb2xlUGx1c09iamVjdC5waWN0dXJlO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIuaXNBY3RpdmF0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuY3JlYXRlKG5ld1VzZXIsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHJlcy5lbWFpbCwgJ3Bhc3N3b3JkJzogcmVzLnBhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VjdXJlQXBpQ2hlY2socmVxOmFueSwgcmVzOmFueSwgbmV4dDphbnkpIHtcclxuICAgIGlmIChyZXEuaXNTaGFyZUFwaSkge1xyXG4gICAgICBuZXh0KCB7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9BUElfQ0hFQ0ssXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQVBJX0NIRUNLLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5leHQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuT2JqZWN0LnNlYWwoQXV0aEludGVyY2VwdG9yKTtcclxuZXhwb3J0ID0gQXV0aEludGVyY2VwdG9yO1xyXG4iXX0=
