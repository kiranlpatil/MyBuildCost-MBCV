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
    AuthInterceptor.prototype.issueTokenWithUid = function (user) {
        console.log("In issue token");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQXFDO0FBQ3JDLGdDQUFrQztBQUNsQyw2Q0FBK0M7QUFDL0MsNkRBQXlEO0FBQ3pELElBQUksY0FBYyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxxQkFBcUIsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMvRCx5RUFBNEU7QUFDNUUsNkNBQThDO0FBRzlDLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBRUU7UUFFRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdEUsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFHbEYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEtBQVUsRUFBRSxJQUFTO1lBQzdELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBVyxLQUFLLENBQUM7WUFDL0IsSUFBSSxDQUFDO2dCQUNILE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLEdBQUcsSUFBSSxL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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXNzcG9ydCBmcm9tIFwicGFzc3BvcnRcIjtcbmltcG9ydCAqIGFzIGp3dCBmcm9tIFwiand0LXNpbXBsZVwiO1xuaW1wb3J0ICogYXMgQmVhcmVyIGZyb20gXCJwYXNzcG9ydC1odHRwLWJlYXJlclwiO1xuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcbnZhciBCZWFyZXJTdHJhdGVneTogYW55ID0gQmVhcmVyLlN0cmF0ZWd5O1xudmFyIEZhY2Vib29rVG9rZW5TdHJhdGVneSA9IHJlcXVpcmUoJ3Bhc3Nwb3J0LWZhY2Vib29rLXRva2VuJyk7XG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeVwiKTtcbmltcG9ydCBNZXNzYWdlcz1yZXF1aXJlKFwiLi4vc2hhcmVkL21lc3NhZ2VzXCIpO1xuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXIubW9kZWxcIik7XG5cbnZhciBHb29nbGVQbHVzVG9rZW5TdHJhdGVneSA9IHJlcXVpcmUoJ3Bhc3Nwb3J0LWdvb2dsZS1wbHVzLXRva2VuJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XG5cbmNsYXNzIEF1dGhJbnRlcmNlcHRvciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB2YXIgZmJDbGllbnRJZCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZmFjZWJvb2tJZHMuY2xpZW50SWQnKTtcbiAgICB2YXIgZmJDbGllbnRTZWNyZXRJZCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZmFjZWJvb2tJZHMuY2xpZW50U2VjcmV0SWQnKTtcbiAgICB2YXIgZ29vZ2xlUGx1c0NsaWVudElkID0gY29uZmlnLmdldCgnVHBsU2VlZC5nb29nbGVQbHVzSWRzLmNsaWVudElkJyk7XG4gICAgdmFyIGdvb2dsZVBsdXNDbGllbnRTZWNyZXRJZCA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZ29vZ2xlUGx1c0lkcy5jbGllbnRTZWNyZXRJZCcpO1xuXG5cbiAgICBwYXNzcG9ydC51c2UobmV3IEJlYXJlclN0cmF0ZWd5KGZ1bmN0aW9uICh0b2tlbjogYW55LCBkb25lOiBhbnkpIHtcbiAgICAgIHZhciBkZWNvZGVkOiBhbnkgPSBudWxsO1xuICAgICAgdmFyIGlzU2hhcmVBcGk6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVjb2RlZCA9IGp3dC5kZWNvZGUodG9rZW4sIENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0pXVF9LRVkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgICAgIGVyci5tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfVE9LRU47XG4gICAgICAgIHJldHVybiBkb25lKGVyciwgZmFsc2UsIG51bGwpO1xuICAgICAgfVxuICAgICAgaWYgKGRlY29kZWQuc2hhcmVLZXkgPT09IENvbnN0VmFyaWFibGVzLkFVVEhFTlRJQ0FUSU9OX0VOQ09ERURfU0hBUkVfS0VZKSB7XG4gICAgICAgIGlzU2hhcmVBcGkgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRlY29kZWQuZXhwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaXRzIGFuIHVuc3Vic2NyaWJlZCBjYWxsIGluIEF1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICB9IGVsc2UgaWYgKGRlY29kZWQuZXhwIDw9IERhdGUubm93KCkpIHtcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgZXJyLm1lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfRVJST1JfVE9LRU5fU0VTU0lPTjtcbiAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIGZhbHNlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihkZWNvZGVkLmlzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgdXNlclJlcG9zaXRvcnkuZmluZEJ5SWQoZGVjb2RlZC5pc3MsIGZ1bmN0aW9uIChlcnIsIHVzZXIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsbnVsbCxudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBmYWxzZSxudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgdXNlciwgaXNTaGFyZUFwaSk7XG4gICAgICAgIH0pO1xuICAgICAgfSAvKmVsc2Uge1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgICAgIGVyci5tZXNzYWdlID0gJ0lzc3VlciBpbiB0b2tlbiBpcyBub3QgYXZhaWxhYmxlJztcbiAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBmYWxzZSwgbnVsbCk7XG4gICAgICB9Ki9cbiAgICB9KSk7XG5cbiAgICBwYXNzcG9ydC51c2UobmV3IEZhY2Vib29rVG9rZW5TdHJhdGVneSh7XG4gICAgICAgIGNsaWVudElEOiBmYkNsaWVudElkLFxuICAgICAgICBjbGllbnRTZWNyZXQ6IGZiQ2xpZW50U2VjcmV0SWRcbiAgICAgICAgLy9jYWxsYmFja1VSTCAgICAgOiAgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9mYkxvZ2luJyxcbiAgICAgICAgLy9wcm9maWxlRmllbGRzOiBbJ2lkJywnZW1haWxzJywgJ2Rpc3BsYXlOYW1lJ11cblxuICAgICAgfSxcblxuICAgICAgLy8gZmFjZWJvb2sgd2lsbCBzZW5kIGJhY2sgdGhlIHRva2VucyBhbmQgcHJvZmlsZVxuICAgICAgZnVuY3Rpb24gKGFjY2Vzc190b2tlbjogYW55LCByZWZyZXNoX3Rva2VuOiBhbnksIHByb2ZpbGU6IGFueSwgZG9uZTogYW55KSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGZpbmQgdGhlIHVzZXIgaW4gdGhlIGRhdGFiYXNlIGJhc2VkIG9uIHRoZWlyIGZhY2Vib29rIGlkXG4gICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgICAgICAgIHZhciBxdWVyeSA9IHtcImVtYWlsXCI6IHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlfTtcbiAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgZnVuY3Rpb24gKGVyciwgdXNlcikge1xuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkb25lKGVyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgdXNlciBpcyBmb3VuZCwgdGhlbiBsb2cgdGhlbSBpblxuICAgICAgICAgICAgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHVzZXJbMF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gdXNlciBmb3VuZCB3aXRoIHRoYXQgZmFjZWJvb2sgaWQsIGNyZWF0ZSB0aGVtXG5cbiAgICAgICAgICAgICAgaWYgKHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1VzZXI6IGFueSA9IDxVc2VyTW9kZWw+e307XG5cbiAgICAgICAgICAgICAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSBwcm9maWxlLm5hbWUuZ2l2ZW5OYW1lO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIubGFzdF9uYW1lID0gcHJvZmlsZS5uYW1lLmZhbWlseU5hbWU7XG4gICAgICAgICAgICAgICAgbmV3VXNlci5lbWFpbCA9IHByb2ZpbGUuZW1haWxzWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IDEyMzQ1Njc4O1xuICAgICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnMTIzNDU2NzgnO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIuY3VycmVudF90aGVtZSA9ICdjb250YWluZXItZmx1aWQgbGlnaHQtdGhlbWUnO1xuXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSBvdXIgdXNlciB0byB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgICAgICB2YXIgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuY3JlYXRlKG5ld1VzZXIsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUoZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCByZXMpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkpO1xuXG4gICAgcGFzc3BvcnQudXNlKG5ldyBHb29nbGVQbHVzVG9rZW5TdHJhdGVneSh7XG4gICAgICAgIGNsaWVudElEOiBnb29nbGVQbHVzQ2xpZW50SWQsXG4gICAgICAgIGNsaWVudFNlY3JldDogZ29vZ2xlUGx1c0NsaWVudFNlY3JldElkLFxuICAgICAgICAvLyBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxuXG4gICAgICB9LFxuXG4gICAgICAvLyBHb29nbGUgd2lsbCBzZW5kIGJhY2sgdGhlIHRva2VucyBhbmQgcHJvZmlsZVxuICAgICAgZnVuY3Rpb24gKHJlcTogYW55LCBhY2Nlc3NfdG9rZW46IGFueSwgcmVmcmVzaF90b2tlbjogYW55LCBwcm9maWxlOiBhbnksIGRvbmU6IGFueSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBmaW5kIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSBiYXNlZCBvbiB0aGVpciBmYWNlYm9vayBpZFxuICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiBwcm9maWxlLmVtYWlsc1swXS52YWx1ZX07XG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIGZ1bmN0aW9uIChlcnIsIHVzZXIpIHtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cbiAgICAgICAgICAgIGlmICh1c2VyLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyWzBdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHVzZXIgZm91bmQgd2l0aCB0aGF0IGdvb2dsZSBpZCwgY3JlYXRlIHRoZW1cblxuICAgICAgICAgICAgICBpZiAocHJvZmlsZS5lbWFpbHNbMF0udmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VXNlcjogYW55ID0gPFVzZXJNb2RlbD57fTtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMDAwMDAwIC0gMTAwMDAwKSArIDEwMDAwMDAwMDApO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9IHByb2ZpbGUubmFtZS5naXZlbk5hbWU7XG4gICAgICAgICAgICAgICAgbmV3VXNlci5sYXN0X25hbWUgPSBwcm9maWxlLm5hbWUuZmFtaWx5TmFtZTtcbiAgICAgICAgICAgICAgICAvL25ld1VzZXIuZW1haWwgPSBwcm9maWxlLmVtYWlsc1swXS52YWx1ZTtcbiAgICAgICAgICAgICAgICBuZXdVc2VyLmVtYWlsID0gcHJvZmlsZS5lbWFpbHNbMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgbmV3VXNlci5tb2JpbGVfbnVtYmVyID0gcmFuZG9tTW9iaWxlTnVtYmVyO1xuICAgICAgICAgICAgICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnWUg4bkA0U2pqIXRZazRxLSc7XG5cbiAgICAgICAgICAgICAgICAvLyBzYXZlIG91ciB1c2VyIHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5jcmVhdGUobmV3VXNlciwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHJlcyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KSk7XG4gIH1cblxuICBpc3N1ZVRva2VuV2l0aFVpZCh1c2VyOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIkluIGlzc3VlIHRva2VuXCIpO1xuICAgIGNvbnNvbGUubG9nKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xuICAgIGNvbnNvbGUubG9nKCd1c2VyJywgdXNlci5pc0NhbmRpZGF0ZSk7XG4gICAgdmFyIGlzc3Vlcjogc3RyaW5nO1xuICAgIGlmICh1c2VyLnVzZXJJZCkge1xuICAgICAgaXNzdWVyID0gdXNlci51c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlzc3VlciA9IHVzZXIuX2lkO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnaXNzdWVyJywgaXNzdWVyKTtcbiAgICB2YXIgY3VyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgLy8gZXhwaXJlcyBpbiA2MCBkYXlzXG4gICAgdmFyIGV4cGlyZXMgPSBuZXcgRGF0ZShjdXJEYXRlLmdldFRpbWUoKSArICg2MCAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTsgLy8oZGF5KmhyKm1pbipzZWMqbWlsaXNlYylcbiAgICB2YXIgdG9rZW4gPSBqd3QuZW5jb2RlKHtcbiAgICAgIGlzczogaXNzdWVyLCAvLyBpc3N1ZVxuICAgICAgZXhwOiBleHBpcmVzLmdldFRpbWUoKSwgLy8gZXhwaXJhdGlvbiB0aW1lXG4gICAgfSwgQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fSldUX0tFWSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9XG5cbiAgaXNzdWVUb2tlbldpdGhVaWRGb3JTaGFyZSh1c2VyOmFueSkge1xuICAgIC8vVG9rZW4gd2l0aCBubyBleHBpcnkgZGF0ZVxuICAgIHZhciBpc3N1ZXI6c3RyaW5nO1xuICAgIHZhciBjdXN0b21LZXk6c3RyaW5nID0gQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fRU5DT0RFRF9TSEFSRV9LRVk7XG4gICAgaWYgKHVzZXIudXNlcklkKSB7XG4gICAgICBpc3N1ZXIgPSB1c2VyLnVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNzdWVyID0gdXNlci5faWQ7XG4gICAgfVxuICAgIHZhciB0b2tlbiA9IGp3dC5lbmNvZGUoe1xuICAgICAgaXNzOiBpc3N1ZXIsIC8vIGlzc3VlXG4gICAgICBzaGFyZUtleTogY3VzdG9tS2V5XG4gICAgfSwgQ29uc3RWYXJpYWJsZXMuQVVUSEVOVElDQVRJT05fSldUX0tFWSk7XG5cbiAgICByZXR1cm4gdG9rZW47XG4gIH1cblxuICByZXF1aXJlc0F1dGgocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcbiAgICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2JlYXJlcicsIHtzZXNzaW9uOiBmYWxzZX0sXG4gICAgICBmdW5jdGlvbiAoZXJyOmFueSwgbXl1c2VyOmFueSwgaXNTaGFyZUFwaTpib29sZWFuKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3JyIGluIGVycm9yJywgSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgICAgICAgICdlcnJvcic6IHtcbiAgICAgICAgICAgICAgcmVhc29uOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicgfHwgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpLmxlbmd0aCAhPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgICAgICAgICAgJ2Vycm9yJzoge1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0lTX0JFQVJFUixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSVNfQkVBUkVSLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFteXVzZXIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcbiAgICAgICAgICAgICAgICAnZXJyb3InOiB7XG4gICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX1RPS0VOXzIsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9UT0tFTl8yLFxuICAgICAgICAgICAgICAgICAgY29kZTogNDAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlcS51c2VyID0gbXl1c2VyO1xuICAgICAgICAgICAgICAoaXNTaGFyZUFwaSkgPyByZXEuaXNTaGFyZUFwaSA9IHRydWUgOiByZXEuaXNTaGFyZUFwaSA9IGZhbHNlO1xuICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KShyZXEsIHJlcywgbmV4dCk7XG4gIH1cblxuICBmYWNlYm9va0F1dGgocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcbiAgICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rLXRva2VuJywge3Njb3BlOiBbJ2VtYWlsJ119LFxuICAgICAgKGVycjogYW55LCB1c2VyOiBhbnksIGluZm86IGFueSkgPT4ge1xuXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5mbykge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRkFDRUJPT0tfQVVUSCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fTk9UX0FMTE9XLFxuICAgICAgICAgICAgY29kZTogNDAxXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXNlcikge1xuICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHVzZXIuZW1haWwsICdwYXNzd29yZCc6IHVzZXIucGFzc3dvcmR9O1xuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0ZBQ0VCT09LX0FVVEgsXG4gICAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICB9KShyZXEsIHJlcywgbmV4dCk7XG4gIH1cblxuICBnb29nbGVBdXRoKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XG4gICAgdmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG4gICAgY29uc29sZS5sb2coJ2dvdCB0b2tlbiBmcm9tIGcrIGluIGJvZHkgICcpO1xuICAgIHJlcXVlc3QoJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92My90b2tlbmluZm8/aWRfdG9rZW49JyArIHJlcS5ib2R5Lmdvb2dsZVRva2VuLCAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT0gXCJFVElNRURPVVRcIikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBFVElNRURPVVQ6JyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DT05ORUNUSU9OX1RJTUVPVVQsXG4gICAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcm1zZyBnb29nbGVBdXRoIDonICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXNwb25zZSkge1xuICAgICAgICBpZiAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XG4gICAgICAgICAgdmFyIGdvb2xlUGx1c09iamVjdCA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJnb29sZVBsdXNPYmplY3QgaXMgYXMgZmx3XCIsIGdvb2xlUGx1c09iamVjdCk7XG4gICAgICAgICAgdmFyIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgICAgICAgIHZhciBxdWVyeSA9IHtcImVtYWlsXCI6IGdvb2xlUGx1c09iamVjdC5lbWFpbH07XG4gICAgICAgICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHVzZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgbmV4dChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgZm91bmQsIHRoZW4gbG9nIHRoZW0gaW5cbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAodXNlclswXS5zb2NpYWxfcHJvZmlsZV9waWN0dXJlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VzZXIgaGFzIHNvY2lhbCBwaWMgOicgKyBKU09OLnN0cmluZ2lmeSh1c2VyWzBdKSk7XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogdXNlclswXS5lbWFpbCwgJ3Bhc3N3b3JkJzogdXNlclswXS5wYXNzd29yZH07XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlciBpbiBxdWVyeSBpc1wiLCB1c2VyWzBdKTtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiB1c2VyWzBdLmVtYWlsfTtcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRGF0YSA9IHtcInNvY2lhbF9wcm9maWxlX3BpY3R1cmVcIjogZ29vbGVQbHVzT2JqZWN0LnBpY3R1cmV9O1xuICAgICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgICAgICB1c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZhaWx1cmUgaW4gc29jaWFsX3Byb2ZpbGVfcGljdHVyZSB1cGRhdGVcIik7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1cpLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgaW4gc29jaWFsX3Byb2ZpbGVfcGljdHVyZSB1cGRhdGUgcmVzdWx0XCIsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcS51c2VyID0geydlbWFpbCc6IHVzZXJbMF0uZW1haWwsICdwYXNzd29yZCc6IHVzZXJbMF0ucGFzc3dvcmR9O1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICB2YXIgbmV3VXNlcjogYW55ID0gPFVzZXJNb2RlbD57fTtcbiAgICAgICAgICAgICAgLy92YXIgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwMDAwMDAwMDAwIC0gMTAwMDAwKSArIDEwMDAwMDAwMDApO1xuICAgICAgICAgICAgICB2YXIgcmFuZG9tTW9iaWxlTnVtYmVyID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XG4gICAgICAgICAgICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9IGdvb2xlUGx1c09iamVjdC5naXZlbl9uYW1lO1xuICAgICAgICAgICAgICBuZXdVc2VyLmxhc3RfbmFtZSA9IGdvb2xlUGx1c09iamVjdC5mYW1pbHlfbmFtZTtcbiAgICAgICAgICAgICAgbmV3VXNlci5lbWFpbCA9IGdvb2xlUGx1c09iamVjdC5lbWFpbDtcbiAgICAgICAgICAgICAgbmV3VXNlci5tb2JpbGVfbnVtYmVyID0gcmFuZG9tTW9iaWxlTnVtYmVyO1xuICAgICAgICAgICAgICBuZXdVc2VyLnBhc3N3b3JkID0gJ1lIOG5ANFNqaiF0WWs0cS0nO1xuICAgICAgICAgICAgICBuZXdVc2VyLmN1cnJlbnRfdGhlbWUgPSAnY29udGFpbmVyLWZsdWlkIGxpZ2h0LXRoZW1lJztcbiAgICAgICAgICAgICAgbmV3VXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlID0gZ29vbGVQbHVzT2JqZWN0LnBpY3R1cmU7XG4gICAgICAgICAgICAgIG5ld1VzZXIuaXNBY3RpdmF0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgIHZhciB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICAgICAgICAgICAgdXNlclJlcG9zaXRvcnkuY3JlYXRlKG5ld1VzZXIsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyIGNyZWF0aW5nIHVzZXIgJyArIGVycik7XG4gICAgICAgICAgICAgICAgICBuZXh0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcykge1xuICAgICAgICAgICAgICAgICAgcmVxLnVzZXIgPSB7J2VtYWlsJzogcmVzLmVtYWlsLCAncGFzc3dvcmQnOiByZXMucGFzc3dvcmR9O1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JFcXVlc3QgOicgKyBKU09OLnN0cmluZ2lmeShyZXEudXNlcikpO1xuICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlY3VyZUFwaUNoZWNrKHJlcTphbnksIHJlczphbnksIG5leHQ6YW55KSB7XG4gICAgaWYgKHJlcS5pc1NoYXJlQXBpKSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xuICAgICAgICAnZXJyb3InOiB7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQVBJX0NIRUNLLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BUElfQ0hFQ0ssXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoKTtcbiAgICB9XG4gIH1cbn1cbk9iamVjdC5zZWFsKEF1dGhJbnRlcmNlcHRvcik7XG5leHBvcnQgPSBBdXRoSW50ZXJjZXB0b3I7XG4iXX0=
