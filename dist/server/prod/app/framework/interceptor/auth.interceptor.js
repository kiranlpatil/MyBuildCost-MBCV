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
        console.log("In issue token", role);
        console.log('user', JSON.stringify(user));
        console.log('user', user.isCandidate);
        var issuer;
        if (user.userId) {
            issuer = user.userId;
        }
        else {
            issuer = user._id;
        }
        console.log('issuer', issuer);
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
                console.log('errorr in error', JSON.stringify(err));
                return res.status(401).send({
                    'error': {
                        reason: err.message,
                        message: err.message,
                        code: 401
                    }
                });
            }
            else {
                if (req.headers.authorization.split(' ')[0].toLowerCase() !== 'bearer' || req.headers.authorization.split(' ').length !== 2) {
                    return res.status(401).send({
                        'error': {
                            reason: Messages.MSG_ERROR_IS_BEARER,
                            message: Messages.MSG_ERROR_IS_BEARER,
                            code: 401
                        }
                    });
                }
                else {
                    if (!myuser) {
                        return res.status(401).send({
                            'error': {
                                reason: Messages.MSG_ERROR_INVALID_TOKEN_2,
                                message: Messages.MSG_ERROR_INVALID_TOKEN_2,
                                code: 401
                            }
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
                    code: 401
                });
            }
        })(req, res, next);
    };
    AuthInterceptor.prototype.googleAuth = function (req, res, next) {
        var request = require('request');
        console.log('got token from g+ in body  ');
        request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.googleToken, function (error, response, body) {
            if (error) {
                if (error.code == "ETIMEDOUT") {
                    console.log('Error ETIMEDOUT:' + JSON.stringify(error));
                    next({
                        reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                        message: Messages.MSG_ERROR_CONNECTION_TIMEOUT,
                        code: 401
                    });
                }
                else {
                    console.log('Errormsg googleAuth :' + JSON.stringify(error));
                }
            }
            else if (response) {
                if (!error && response.statusCode == 200) {
                    var goolePlusObject = JSON.parse(body);
                    console.log("goolePlusObject is as flw", goolePlusObject);
                    var userRepository = new UserRepository();
                    var query = { "email": goolePlusObject.email };
                    userRepository.retrieve(query, function (err, user) {
                        if (err) {
                            next(err);
                        }
                        else if (user.length > 0) {
                            if (user[0].social_profile_picture) {
                                console.log('User has social pic :' + JSON.stringify(user[0]));
                                req.user = { 'email': user[0].email, 'password': user[0].password };
                                next();
                            }
                            else {
                                console.log("user in query is", user[0]);
                                var query = { "email": user[0].email };
                                var updateData = { "social_profile_picture": goolePlusObject.picture };
                                var userRepository = new UserRepository();
                                userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                                    if (error) {
                                        console.log("failure in social_profile_picture update");
                                        next(error);
                                    }
                                    else {
                                        console.log("success in social_profile_picture update result", result);
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
                                    console.log('Err creating user ' + err);
                                    next(err);
                                }
                                else if (res) {
                                    req.user = { 'email': res.email, 'password': res.password };
                                    console.log('REquest :' + JSON.stringify(req.user));
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
            return res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_API_CHECK,
                    message: Messages.MSG_ERROR_API_CHECK,
                    code: 401
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXFDO0FBQ3JDLGdDQUFrQztBQUNsQyw2Q0FBK0M7QUFDL0MsNkRBQXlEO0FBQ3pELElBQUksY0FBYyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvRCx5RUFBNEU7QUFDNUUsNkNBQThDO0FBRzlDLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBRUU7UUFFRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdEUsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFHbEYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQVUsRUFBRSxJQUFTO1lBQzdELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxL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QWUsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXNzcG9ydCBmcm9tIFwicGFzc3BvcnRcIjtcclxuaW1wb3J0ICogYXMgand0IGZyb20gXCJqd3Qtc2ltcGxlXCI7XHJcbmltcG9ydCAqIGFzIEJlYXJlciBmcm9tIFwicGFzc3BvcnQtaHR0cC1iZWFyZXJcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxudmFyIEJlYXJlclN0cmF0ZWd5OiBhbnkgPSBCZWFyZXIuU3RyYXRlZ3k7XHJcbnZhciBGYWNlYm9va1Rva2VuU3RyYXRlZ3kgPSByZXF1aXJlKCdwYXNzcG9ydC1mYWNlYm9vay10b2tlbicpO1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeVwiKTtcclxuaW1wb3J0IE1lc3NhZ2VzPXJlcXVpcmUoXCIuLi9zaGFyZWQvbWVzc2FnZXNcIik7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsXCIpO1xyXG5cclxudmFyIEdvb2dsZVBsdXNUb2tlblN0cmF0ZWd5ID0gcmVxdWlyZSgncGFzc3BvcnQtZ29vZ2xlLXBsdXMtdG9rZW4nKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5cclxuY2xhc3MgQXV0aEludGVyY2VwdG9yIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgdmFyIGZiQ2xpZW50SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmZhY2Vib29rSWRzLmNsaWVudElkJyk7XHJcbiAgICB2YXIgZmJDbGllbnRTZWNyZXRJZCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZmFjZWJvb2tJZHMuY2xpZW50U2VjcmV0SWQnKTtcclxuICAgIHZhciBnb29nbGVQbHVzQ2xpZW50SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmdvb2dsZVBsdXNJZHMuY2xpZW50SWQnKTtcclxuICAgIHZhciBnb29nbGVQbHVzQ2xpZW50U2VjcmV0SWQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmdvb2dsZVBsdXNJZHMuY2xpZW50U2VjcmV0SWQnKTtcclxuXHJcblxyXG4gICAgcGFzc3BvcnQudXNlKG5ldyBCZWFyZXJTdHJhdGVneShmdW5jdGlvbiAodG9rZW46IGFueSwgZG9uZTogYW55KSB7XHJcbiAgICAgIHZhciBkZWNvZGVkOiBhbnkgPSBudWxsO1xyXG4gICAgICB2YXIgaXNTaGFyZUFwaTpib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZGVjb2RlZCA9IGp3dC5kZWNvZGUodG9rZW4sIENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0pXVF9LRVkpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgIGVyci5tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU47XHJcbiAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRlY29kZWQuc2hhcmVLZXkgPT09IENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0VOQ09ERURfU0hBUkVfS0VZKSB7XHJcbiAgICAgICAgaXNTaGFyZUFwaSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGRlY29kZWQuZXhwID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdpdHMgYW4gdW5zdWJzY3JpYmVkIGNhbGwgaW4gQXV0aEludGVyY2VwdG9yJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkZWNvZGVkLmV4cCA8PSBEYXRlLm5vdygpKSB7XHJcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnIubWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9UT0tFTl9TRVNTSU9OO1xyXG4gICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBmYWxzZSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihkZWNvZGVkLmlzcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgIHVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGRlY29kZWQuaXNzLCBmdW5jdGlvbiAoZXJyLCB1c2VyKSB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb25lKGVycixudWxsLG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIGZhbHNlLG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlciwgaXNTaGFyZUFwaSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gLyplbHNlIHtcclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgZXJyLm1lc3NhZ2UgPSAnSXNzdWVyIGluIHRva2VuIGlzIG5vdCBhdmFpbGFibGUnO1xyXG4gICAgICAgIHJldHVybiBkb25lKGVyciwgZmFsc2UsIG51bGwpO1xyXG4gICAgICB9Ki9cclxuICAgIH0pKTtcclxuXHJcbiAgICBwYXNzcG9ydC51c2UobmV3IEZhY2Vib29rVG9rZW5TdHJhdGVneSh7XHJcbiAgICAgICAgY2xpZW50SUQ6IGZiQ2xpZW50SWQsXHJcbiAgICAgICAgY2xpZW50U2VjcmV0OiBmYkNsaWVudFNlY3JldElkXHJcbiAgICAgICAgLy9jYWxsYmFja1VSTCAgICAgOiAgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9mYkxvZ2luJyxcclxuICAgICAgICAvL3Byb2ZpbGVGaWVsZHM6IFsnaWQnLCdlbWFpbHMnLCAnZGlzcGxheU5hbWUnXVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGZhY2Vib29rIHdpbGwgc2VuZCBiYWNrIHRoZSB0b2tlbnMgYW5kIHByb2ZpbGVcclxuICAgICAgZnVuY3Rpb24gKGFjY2Vzc190b2tlbjogYW55LCByZWZyZXNoX3Rva2VuOiBhbnksIHByb2ZpbGU6IGFueSwgZG9uZTogYW55KSB7XHJcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvLyBmaW5kIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSBiYXNlZCBvbiB0aGVpciBmYWNlYm9vayBpZFxyXG4gICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogcHJvZmlsZS5lbWFpbHNbMF0udmFsdWV9O1xyXG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIGZ1bmN0aW9uIChlcnIsIHVzZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIGZvdW5kLCB0aGVuIGxvZyB0aGVtIGluXHJcbiAgICAgICAgICAgIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlclswXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gdXNlciBmb3VuZCB3aXRoIHRoYXQgZmFjZWJvb2sgaWQsIGNyZWF0ZSB0aGVtXHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcm9maWxlLmVtYWlsc1swXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XHJcblxyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5maXJzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmdpdmVuTmFtZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmZhbWlseU5hbWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmVtYWlsID0gcHJvZmlsZS5lbWFpbHNbMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBuZXdVc2VyLm1vYmlsZV9udW1iZXIgPSAxMjM0NTY3ODtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnMTIzNDU2NzgnO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5jdXJyZW50X3RoZW1lID0gJ2NvbnRhaW5lci1mbHVpZCBsaWdodC10aGVtZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBvdXIgdXNlciB0byB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KSk7XHJcblxyXG4gICAgcGFzc3BvcnQudXNlKG5ldyBHb29nbGVQbHVzVG9rZW5TdHJhdGVneSh7XHJcbiAgICAgICAgY2xpZW50SUQ6IGdvb2dsZVBsdXNDbGllbnRJZCxcclxuICAgICAgICBjbGllbnRTZWNyZXQ6IGdvb2dsZVBsdXNDbGllbnRTZWNyZXRJZCxcclxuICAgICAgICAvLyBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxyXG5cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIEdvb2dsZSB3aWxsIHNlbmQgYmFjayB0aGUgdG9rZW5zIGFuZCBwcm9maWxlXHJcbiAgICAgIGZ1bmN0aW9uIChyZXE6IGFueSwgYWNjZXNzX3Rva2VuOiBhbnksIHJlZnJlc2hfdG9rZW46IGFueSwgcHJvZmlsZTogYW55LCBkb25lOiBhbnkpIHtcclxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vIGZpbmQgdGhlIHVzZXIgaW4gdGhlIGRhdGFiYXNlIGJhc2VkIG9uIHRoZWlyIGZhY2Vib29rIGlkXHJcbiAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiBwcm9maWxlLmVtYWlsc1swXS52YWx1ZX07XHJcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgZnVuY3Rpb24gKGVyciwgdXNlcikge1xyXG5cclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cclxuICAgICAgICAgICAgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyWzBdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB1c2VyIGZvdW5kIHdpdGggdGhhdCBnb29nbGUgaWQsIGNyZWF0ZSB0aGVtXHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcm9maWxlLmVtYWlsc1swXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XHJcbiAgICAgICAgICAgICAgICB2YXIgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMDAwMDAwIC0gMTAwMDAwKSArIDEwMDAwMDAwMDApO1xyXG4gICAgICAgICAgICAgICAgbmV3VXNlci5maXJzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmdpdmVuTmFtZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmZhbWlseU5hbWU7XHJcbiAgICAgICAgICAgICAgICAvL25ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IHJhbmRvbU1vYmlsZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnWUg4bkA0U2pqIXRZazRxLSc7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBvdXIgdXNlciB0byB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgICAgICAgIHVzZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdVc2VyLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KSk7XHJcbiAgfVxyXG5cclxuICBpc3N1ZVRva2VuV2l0aFVpZCh1c2VyOiBhbnkscm9sZT86c3RyaW5nKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkluIGlzc3VlIHRva2VuXCIscm9sZSk7XHJcbiAgICBjb25zb2xlLmxvZygndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgIGNvbnNvbGUubG9nKCd1c2VyJywgdXNlci5pc0NhbmRpZGF0ZSk7XHJcbiAgICB2YXIgaXNzdWVyOiBzdHJpbmc7XHJcbiAgICBpZiAodXNlci51c2VySWQpIHtcclxuICAgICAgaXNzdWVyID0gdXNlci51c2VySWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpc3N1ZXIgPSB1c2VyLl9pZDtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdpc3N1ZXInLCBpc3N1ZXIpO1xyXG4gICAgdmFyIGN1ckRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gZXhwaXJlcyBpbiA2MCBkYXlzXHJcbiAgICB2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKGN1ckRhdGUuZ2V0VGltZSgpICsgKDYwICogMjQgKiA2MCAqIDYwICogMTAwMCkpOyAvLyhkYXkqaHIqbWluKnNlYyptaWxpc2VjKVxyXG4gICAgdmFyIHRva2VuID0gand0LmVuY29kZSh7XHJcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxyXG4gICAgICBleHA6IGV4cGlyZXMuZ2V0VGltZSgpLCAvLyBleHBpcmF0aW9uIHRpbWVcclxuICAgICAgcm9sZTogcm9sZVxyXG4gICAgfSwgQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fSldUX0tFWSk7XHJcbiAgICByZXR1cm4gdG9rZW47XHJcbiAgfVxyXG5cclxuICBpc3N1ZVRva2VuV2l0aFVpZEZvclNoYXJlKHVzZXI6YW55KSB7XHJcbiAgICAvL1Rva2VuIHdpdGggbm8gZXhwaXJ5IGRhdGVcclxuICAgIHZhciBpc3N1ZXI6c3RyaW5nO1xyXG4gICAgdmFyIGN1c3RvbUtleTpzdHJpbmcgPSBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9FTkNPREVEX1NIQVJFX0tFWTtcclxuICAgIGlmICh1c2VyLnVzZXJJZCkge1xyXG4gICAgICBpc3N1ZXIgPSB1c2VyLnVzZXJJZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlzc3VlciA9IHVzZXIuX2lkO1xyXG4gICAgfVxyXG4gICAgdmFyIHRva2VuID0gand0LmVuY29kZSh7XHJcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxyXG4gICAgICBzaGFyZUtleTogY3VzdG9tS2V5XHJcbiAgICB9LCBDb25zdFZhcmlhYmxlcy5BVVRIRU5USUNBVElPTl9KV1RfS0VZKTtcclxuXHJcbiAgICByZXR1cm4gdG9rZW47XHJcbiAgfVxyXG5cclxuICByZXF1aXJlc0F1dGgocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnYmVhcmVyJywge3Nlc3Npb246IGZhbHNlfSxcclxuICAgICAgZnVuY3Rpb24gKGVycjphbnksIG15dXNlcjphbnksIGlzU2hhcmVBcGk6Ym9vbGVhbikge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcnIgaW4gZXJyb3InLCBKU09OLnN0cmluZ2lmeShlcnIpKTtcclxuICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgICAgICdlcnJvcic6IHtcclxuICAgICAgICAgICAgICByZWFzb246IGVyci5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXS50b0xvd2VyQ2FzZSgpICE9PSAnYmVhcmVyJyB8fCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJykubGVuZ3RoICE9PSAyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfSVNfQkVBUkVSLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0lTX0JFQVJFUixcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIW15dXNlcikge1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnZXJyb3InOiB7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU5fMixcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU5fMixcclxuICAgICAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVxLnVzZXIgPSBteXVzZXI7XHJcbiAgICAgICAgICAgICAgKGlzU2hhcmVBcGkpID8gcmVxLmlzU2hhcmVBcGkgPSB0cnVlIDogcmVxLmlzU2hhcmVBcGkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pKHJlcSwgcmVzLCBuZXh0KTtcclxuICB9XHJcblxyXG4gIGZhY2Vib29rQXV0aChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdmYWNlYm9vay10b2tlbicsIHtzY29wZTogWydlbWFpbCddfSxcclxuICAgICAgKGVycjogYW55LCB1c2VyOiBhbnksIGluZm86IGFueSkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGluZm8pIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUNFQk9PS19BVVRILFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX05PVF9BTExPVyxcclxuICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodXNlcikge1xyXG4gICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlci5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlci5wYXNzd29yZH07XHJcbiAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRkFDRUJPT0tfQVVUSCxcclxuICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KShyZXEsIHJlcywgbmV4dCk7XHJcbiAgfVxyXG5cclxuICBnb29nbGVBdXRoKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuICAgIGNvbnNvbGUubG9nKCdnb3QgdG9rZW4gZnJvbSBnKyBpbiBib2R5ICAnKTtcclxuICAgIHJlcXVlc3QoJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92My90b2tlbmluZm8/aWRfdG9rZW49JyArIHJlcS5ib2R5Lmdvb2dsZVRva2VuLCAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvci5jb2RlID09IFwiRVRJTUVET1VUXCIpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBFVElNRURPVVQ6JyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DT05ORUNUSU9OX1RJTUVPVVQsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcm1zZyBnb29nbGVBdXRoIDonICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgdmFyIGdvb2xlUGx1c09iamVjdCA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImdvb2xlUGx1c09iamVjdCBpcyBhcyBmbHdcIiwgZ29vbGVQbHVzT2JqZWN0KTtcclxuICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgIHZhciBxdWVyeSA9IHtcImVtYWlsXCI6IGdvb2xlUGx1c09iamVjdC5lbWFpbH07XHJcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgdXNlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZSB1c2VyIGlzIGZvdW5kLCB0aGVuIGxvZyB0aGVtIGluXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIGlmICh1c2VyWzBdLnNvY2lhbF9wcm9maWxlX3BpY3R1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVc2VyIGhhcyBzb2NpYWwgcGljIDonICsgSlNPTi5zdHJpbmdpZnkodXNlclswXSkpO1xyXG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlclswXS5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlclswXS5wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIGluIHF1ZXJ5IGlzXCIsIHVzZXJbMF0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogdXNlclswXS5lbWFpbH07XHJcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRGF0YSA9IHtcInNvY2lhbF9wcm9maWxlX3BpY3R1cmVcIjogZ29vbGVQbHVzT2JqZWN0LnBpY3R1cmV9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbHVyZSBpbiBzb2NpYWxfcHJvZmlsZV9waWN0dXJlIHVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1cpLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgaW4gc29jaWFsX3Byb2ZpbGVfcGljdHVyZSB1cGRhdGUgcmVzdWx0XCIsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlclswXS5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlclswXS5wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodXNlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICB2YXIgbmV3VXNlcjogYW55ID0gPFVzZXJNb2RlbD57fTtcclxuICAgICAgICAgICAgICAvL3ZhciByYW5kb21Nb2JpbGVOdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAwMDAwMDAwMDAgLSAxMDAwMDApICsgMTAwMDAwMDAwMCk7XHJcbiAgICAgICAgICAgICAgdmFyIHJhbmRvbU1vYmlsZU51bWJlciA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9IGdvb2xlUGx1c09iamVjdC5naXZlbl9uYW1lO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gZ29vbGVQbHVzT2JqZWN0LmZhbWlseV9uYW1lO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIuZW1haWwgPSBnb29sZVBsdXNPYmplY3QuZW1haWw7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5tb2JpbGVfbnVtYmVyID0gcmFuZG9tTW9iaWxlTnVtYmVyO1xyXG4gICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnWUg4bkA0U2pqIXRZazRxLSc7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5jdXJyZW50X3RoZW1lID0gJ2NvbnRhaW5lci1mbHVpZCBsaWdodC10aGVtZSc7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlID0gZ29vbGVQbHVzT2JqZWN0LnBpY3R1cmU7XHJcbiAgICAgICAgICAgICAgbmV3VXNlci5pc0FjdGl2YXRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5jcmVhdGUobmV3VXNlciwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyIGNyZWF0aW5nIHVzZXIgJyArIGVycik7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICByZXEudXNlciA9IHsnZW1haWwnOiByZXMuZW1haWwsICdwYXNzd29yZCc6IHJlcy5wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSRXF1ZXN0IDonICsgSlNPTi5zdHJpbmdpZnkocmVxLnVzZXIpKTtcclxuICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VjdXJlQXBpQ2hlY2socmVxOmFueSwgcmVzOmFueSwgbmV4dDphbnkpIHtcclxuICAgIGlmIChyZXEuaXNTaGFyZUFwaSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xyXG4gICAgICAgICdlcnJvcic6IHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0FQSV9DSEVDSyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BUElfQ0hFQ0ssXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk9iamVjdC5zZWFsKEF1dGhJbnRlcmNlcHRvcik7XHJcbmV4cG9ydCA9IEF1dGhJbnRlcmNlcHRvcjtcclxuIl19
