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
                        code: 401
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXFDO0FBQ3JDLGdDQUFrQztBQUNsQyw2Q0FBK0M7QUFDL0MsNkRBQTJEO0FBQzNELElBQUksY0FBYyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvRCx5RUFBNEU7QUFDNUUsNkNBQThDO0FBRzlDLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBRUU7UUFFRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdEUsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFHbEYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQVUsRUFBRSxJQUFTO1lBQzdELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxL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QUFDO0lBQ0gsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0F6V0EsQUF5V0MsSUFBQTtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsaUJBQVMsZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhc3Nwb3J0IGZyb20gXCJwYXNzcG9ydFwiO1xuaW1wb3J0ICogYXMgand0IGZyb20gXCJqd3Qtc2ltcGxlXCI7XG5pbXBvcnQgKiBhcyBCZWFyZXIgZnJvbSBcInBhc3Nwb3J0LWh0dHAtYmVhcmVyXCI7XG5pbXBvcnQgeyBDb25zdFZhcmlhYmxlcyB9IGZyb20gXCIuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XG52YXIgQmVhcmVyU3RyYXRlZ3k6IGFueSA9IEJlYXJlci5TdHJhdGVneTtcbnZhciBGYWNlYm9va1Rva2VuU3RyYXRlZ3kgPSByZXF1aXJlKCdwYXNzcG9ydC1mYWNlYm9vay10b2tlbicpO1xuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgTWVzc2FnZXM9cmVxdWlyZShcIi4uL3NoYXJlZC9tZXNzYWdlc1wiKTtcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsXCIpO1xuXG52YXIgR29vZ2xlUGx1c1Rva2VuU3RyYXRlZ3kgPSByZXF1aXJlKCdwYXNzcG9ydC1nb29nbGUtcGx1cy10b2tlbicpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuXG5jbGFzcyBBdXRoSW50ZXJjZXB0b3Ige1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdmFyIGZiQ2xpZW50SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZhY2Vib29rSWRzLmNsaWVudElkJyk7XG4gICAgdmFyIGZiQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZhY2Vib29rSWRzLmNsaWVudFNlY3JldElkJyk7XG4gICAgdmFyIGdvb2dsZVBsdXNDbGllbnRJZCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZ29vZ2xlUGx1c0lkcy5jbGllbnRJZCcpO1xuICAgIHZhciBnb29nbGVQbHVzQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmdvb2dsZVBsdXNJZHMuY2xpZW50U2VjcmV0SWQnKTtcblxuXG4gICAgcGFzc3BvcnQudXNlKG5ldyBCZWFyZXJTdHJhdGVneShmdW5jdGlvbiAodG9rZW46IGFueSwgZG9uZTogYW55KSB7XG4gICAgICB2YXIgZGVjb2RlZDogYW55ID0gbnVsbDtcbiAgICAgIHZhciBpc1NoYXJlQXBpOmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRlY29kZWQgPSBqd3QuZGVjb2RlKHRva2VuLCBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9KV1RfS0VZKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgICAgICBlcnIubWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX1RPS0VOO1xuICAgICAgICByZXR1cm4gZG9uZShlcnIsIGZhbHNlLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWNvZGVkLnNoYXJlS2V5ID09PSBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9FTkNPREVEX1NIQVJFX0tFWSkge1xuICAgICAgICBpc1NoYXJlQXBpID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkZWNvZGVkLmV4cCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2l0cyBhbiB1bnN1YnNjcmliZWQgY2FsbCBpbiBBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgfSBlbHNlIGlmIChkZWNvZGVkLmV4cCA8PSBEYXRlLm5vdygpKSB7XG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgICAgICAgIGVyci5tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1RPS0VOX1NFU1NJT047XG4gICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoZGVjb2RlZC5pc3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgIHVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGRlY29kZWQuaXNzLCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLG51bGwsbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgZmFsc2UsbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHVzZXIsIGlzU2hhcmVBcGkpO1xuICAgICAgICB9KTtcbiAgICAgIH0gLyplbHNlIHtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgICAgICBlcnIubWVzc2FnZSA9ICdJc3N1ZXIgaW4gdG9rZW4gaXMgbm90IGF2YWlsYWJsZSc7XG4gICAgICAgIHJldHVybiBkb25lKGVyciwgZmFsc2UsIG51bGwpO1xuICAgICAgfSovXG4gICAgfSkpO1xuXG4gICAgcGFzc3BvcnQudXNlKG5ldyBGYWNlYm9va1Rva2VuU3RyYXRlZ3koe1xuICAgICAgICBjbGllbnRJRDogZmJDbGllbnRJZCxcbiAgICAgICAgY2xpZW50U2VjcmV0OiBmYkNsaWVudFNlY3JldElkXG4gICAgICAgIC8vY2FsbGJhY2tVUkwgICAgIDogICdodHRwOi8vbG9jYWxob3N0OjgwODAvZmJMb2dpbicsXG4gICAgICAgIC8vcHJvZmlsZUZpZWxkczogWydpZCcsJ2VtYWlscycsICdkaXNwbGF5TmFtZSddXG5cbiAgICAgIH0sXG5cbiAgICAgIC8vIGZhY2Vib29rIHdpbGwgc2VuZCBiYWNrIHRoZSB0b2tlbnMgYW5kIHByb2ZpbGVcbiAgICAgIGZ1bmN0aW9uIChhY2Nlc3NfdG9rZW46IGFueSwgcmVmcmVzaF90b2tlbjogYW55LCBwcm9maWxlOiBhbnksIGRvbmU6IGFueSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBmaW5kIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSBiYXNlZCBvbiB0aGVpciBmYWNlYm9vayBpZFxuICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiBwcm9maWxlLmVtYWlsc1swXS52YWx1ZX07XG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIGZ1bmN0aW9uIChlcnIsIHVzZXIpIHtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cbiAgICAgICAgICAgIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyWzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHVzZXIgZm91bmQgd2l0aCB0aGF0IGZhY2Vib29rIGlkLCBjcmVhdGUgdGhlbVxuXG4gICAgICAgICAgICAgIGlmIChwcm9maWxlLmVtYWlsc1swXS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdVc2VyOiBhbnkgPSA8VXNlck1vZGVsPnt9O1xuXG4gICAgICAgICAgICAgICAgbmV3VXNlci5maXJzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmdpdmVuTmFtZTtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmxhc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5mYW1pbHlOYW1lO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLm1vYmlsZV9udW1iZXIgPSAxMjM0NTY3ODtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJzEyMzQ1Njc4JztcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmN1cnJlbnRfdGhlbWUgPSAnY29udGFpbmVyLWZsdWlkIGxpZ2h0LXRoZW1lJztcblxuICAgICAgICAgICAgICAgIC8vIHNhdmUgb3VyIHVzZXIgdG8gdGhlIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgcmVzKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pKTtcblxuICAgIHBhc3Nwb3J0LnVzZShuZXcgR29vZ2xlUGx1c1Rva2VuU3RyYXRlZ3koe1xuICAgICAgICBjbGllbnRJRDogZ29vZ2xlUGx1c0NsaWVudElkLFxuICAgICAgICBjbGllbnRTZWNyZXQ6IGdvb2dsZVBsdXNDbGllbnRTZWNyZXRJZCxcbiAgICAgICAgLy8gcGFzc1JlcVRvQ2FsbGJhY2s6IHRydWVcblxuICAgICAgfSxcblxuICAgICAgLy8gR29vZ2xlIHdpbGwgc2VuZCBiYWNrIHRoZSB0b2tlbnMgYW5kIHByb2ZpbGVcbiAgICAgIGZ1bmN0aW9uIChyZXE6IGFueSwgYWNjZXNzX3Rva2VuOiBhbnksIHJlZnJlc2hfdG9rZW46IGFueSwgcHJvZmlsZTogYW55LCBkb25lOiBhbnkpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gZmluZCB0aGUgdXNlciBpbiB0aGUgZGF0YWJhc2UgYmFzZWQgb24gdGhlaXIgZmFjZWJvb2sgaWRcbiAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogcHJvZmlsZS5lbWFpbHNbMF0udmFsdWV9O1xuICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIGZvdW5kLCB0aGVuIGxvZyB0aGVtIGluXG4gICAgICAgICAgICBpZiAodXNlci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlclswXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB1c2VyIGZvdW5kIHdpdGggdGhhdCBnb29nbGUgaWQsIGNyZWF0ZSB0aGVtXG5cbiAgICAgICAgICAgICAgaWYgKHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XG4gICAgICAgICAgICAgICAgdmFyIHJhbmRvbU1vYmlsZU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAwMDAwMCAtIDEwMDAwMCkgKyAxMDAwMDAwMDAwKTtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSBwcm9maWxlLm5hbWUuZ2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmZhbWlseU5hbWU7XG4gICAgICAgICAgICAgICAgLy9uZXdVc2VyLmVtYWlsID0gcHJvZmlsZS5lbWFpbHNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3VXNlci5lbWFpbCA9IHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IHJhbmRvbU1vYmlsZU51bWJlcjtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJ1lIOG5ANFNqaiF0WWs0cS0nO1xuXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBvdXIgdXNlciB0byB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuY3JlYXRlKG5ld1VzZXIsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCByZXMpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkpO1xuICB9XG5cbiAgaXNzdWVUb2tlbldpdGhVaWQodXNlcjogYW55LHJvbGU/OnN0cmluZykge1xuICAgIHZhciBpc3N1ZXI6IHN0cmluZztcbiAgICBpZiAodXNlci51c2VySWQpIHtcbiAgICAgIGlzc3VlciA9IHVzZXIudXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpc3N1ZXIgPSB1c2VyLl9pZDtcbiAgICB9XG4gICAgdmFyIGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIC8vIGV4cGlyZXMgaW4gNjAgZGF5c1xuICAgIHZhciBleHBpcmVzID0gbmV3IERhdGUoY3VyRGF0ZS5nZXRUaW1lKCkgKyAoNjAgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7IC8vKGRheSpociptaW4qc2VjKm1pbGlzZWMpXG4gICAgdmFyIHRva2VuID0gand0LmVuY29kZSh7XG4gICAgICBpc3M6IGlzc3VlciwgLy8gaXNzdWVcbiAgICAgIGV4cDogZXhwaXJlcy5nZXRUaW1lKCksIC8vIGV4cGlyYXRpb24gdGltZVxuICAgICAgcm9sZTogcm9sZVxuICAgIH0sIENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0pXVF9LRVkpO1xuICAgIHJldHVybiB0b2tlbjtcbiAgfVxuXG4gIGlzc3VlVG9rZW5XaXRoVWlkRm9yU2hhcmUodXNlcjphbnkpIHtcbiAgICAvL1Rva2VuIHdpdGggbm8gZXhwaXJ5IGRhdGVcbiAgICB2YXIgaXNzdWVyOnN0cmluZztcbiAgICB2YXIgY3VzdG9tS2V5OnN0cmluZyA9IENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0VOQ09ERURfU0hBUkVfS0VZO1xuICAgIGlmICh1c2VyLnVzZXJJZCkge1xuICAgICAgaXNzdWVyID0gdXNlci51c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzc3VlciA9IHVzZXIuX2lkO1xuICAgIH1cbiAgICB2YXIgdG9rZW4gPSBqd3QuZW5jb2RlKHtcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxuICAgICAgc2hhcmVLZXk6IGN1c3RvbUtleVxuICAgIH0sIENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0pXVF9LRVkpO1xuXG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG5cbiAgcmVxdWlyZXNBdXRoKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XG4gICAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdiZWFyZXInLCB7c2Vzc2lvbjogZmFsc2V9LFxuICAgICAgZnVuY3Rpb24gKGVycjphbnksIG15dXNlcjphbnksIGlzU2hhcmVBcGk6Ym9vbGVhbikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgIHJlYXNvbjogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgaWYgKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXS50b0xvd2VyQ2FzZSgpICE9PSAnYmVhcmVyJyB8fCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJykubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgICAgICAgIG5leHQoIHtcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0lTX0JFQVJFUixcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JU19CRUFSRVIsXG4gICAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmICghbXl1c2VyKSB7XG4gICAgICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU5fMixcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU5fMixcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSBteXVzZXI7XG4gICAgICAgICAgICAgICAgKGlzU2hhcmVBcGkpID8gcmVxLmlzU2hhcmVBcGkgPSB0cnVlIDogcmVxLmlzU2hhcmVBcGkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9UT0tFTl9OT1RfUFJPVklERUQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKHJlcSwgcmVzLCBuZXh0KTtcbiAgfVxuXG4gIGZhY2Vib29rQXV0aChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xuICAgIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnZmFjZWJvb2stdG9rZW4nLCB7c2NvcGU6IFsnZW1haWwnXX0sXG4gICAgICAoZXJyOiBhbnksIHVzZXI6IGFueSwgaW5mbzogYW55KSA9PiB7XG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmZvKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUNFQk9PS19BVVRILFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9OT1RfQUxMT1csXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVzZXIpIHtcbiAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiB1c2VyLmVtYWlsLCAncGFzc3dvcmQnOiB1c2VyLnBhc3N3b3JkfTtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUNFQk9PS19BVVRILFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICB9KShyZXEsIHJlcywgbmV4dCk7XG4gIH1cblxuICBnb29nbGVBdXRoKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XG4gICAgdmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG4gICAgcmVxdWVzdCgnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuaW5mbz9pZF90b2tlbj0nICsgcmVxLmJvZHkuZ29vZ2xlVG9rZW4sIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IuY29kZSA9PSBcIkVUSU1FRE9VVFwiKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DT05ORUNUSU9OX1RJTUVPVVQsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICB2YXIgZ29vbGVQbHVzT2JqZWN0ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogZ29vbGVQbHVzT2JqZWN0LmVtYWlsfTtcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgdXNlcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyBmb3VuZCwgdGhlbiBsb2cgdGhlbSBpblxuICAgICAgICAgICAgZWxzZSBpZiAodXNlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICh1c2VyWzBdLnNvY2lhbF9wcm9maWxlX3BpY3R1cmUpIHtcbiAgICAgICAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiB1c2VyWzBdLmVtYWlsLCAncGFzc3dvcmQnOiB1c2VyWzBdLnBhc3N3b3JkfTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogdXNlclswXS5lbWFpbH07XG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJzb2NpYWxfcHJvZmlsZV9waWN0dXJlXCI6IGdvb2xlUGx1c09iamVjdC5waWN0dXJlfTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfRU1BSUxfQUNUSVZFX05PVyksIG51bGwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHVzZXJbMF0uZW1haWwsICdwYXNzd29yZCc6IHVzZXJbMF0ucGFzc3dvcmR9O1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodXNlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XG4gICAgICAgICAgICAgIC8vdmFyIHJhbmRvbU1vYmlsZU51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAwMDAwMCAtIDEwMDAwMCkgKyAxMDAwMDAwMDAwKTtcbiAgICAgICAgICAgICAgdmFyIHJhbmRvbU1vYmlsZU51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xuICAgICAgICAgICAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSBnb29sZVBsdXNPYmplY3QuZ2l2ZW5fbmFtZTtcbiAgICAgICAgICAgICAgbmV3VXNlci5sYXN0X25hbWUgPSBnb29sZVBsdXNPYmplY3QuZmFtaWx5X25hbWU7XG4gICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBnb29sZVBsdXNPYmplY3QuZW1haWw7XG4gICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IHJhbmRvbU1vYmlsZU51bWJlcjtcbiAgICAgICAgICAgICAgbmV3VXNlci5wYXNzd29yZCA9ICdZSDhuQDRTamohdFlrNHEtJztcbiAgICAgICAgICAgICAgbmV3VXNlci5jdXJyZW50X3RoZW1lID0gJ2NvbnRhaW5lci1mbHVpZCBsaWdodC10aGVtZSc7XG4gICAgICAgICAgICAgIG5ld1VzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSA9IGdvb2xlUGx1c09iamVjdC5waWN0dXJlO1xuICAgICAgICAgICAgICBuZXdVc2VyLmlzQWN0aXZhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHJlcy5lbWFpbCwgJ3Bhc3N3b3JkJzogcmVzLnBhc3N3b3JkfTtcbiAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWN1cmVBcGlDaGVjayhyZXE6YW55LCByZXM6YW55LCBuZXh0OmFueSkge1xuICAgIGlmIChyZXEuaXNTaGFyZUFwaSkge1xuICAgICAgbmV4dCgge1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0FQSV9DSEVDSyxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQVBJX0NIRUNLLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgfVxufVxuT2JqZWN0LnNlYWwoQXV0aEludGVyY2VwdG9yKTtcbmV4cG9ydCA9IEF1dGhJbnRlcmNlcHRvcjtcbiJdfQ==
