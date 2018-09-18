import * as passport from 'passport';
import * as jwt from 'jwt-simple';
import * as Bearer from 'passport-http-bearer';
import {ConstVariables} from '../shared/sharedconstants';
let BearerStrategy: any = Bearer.Strategy;
let FacebookTokenStrategy = require('passport-facebook-token');
import UserRepository = require('../dataaccess/repository/UserRepository');
import Messages=require('../shared/messages');
import UserModel = require('../dataaccess/model/UserModel');

let GooglePlusTokenStrategy = require('passport-google-plus-token');
let config = require('config');

class AuthInterceptor {

  constructor() {

    let fbClientId = config.get('application.facebookIds.clientId');
    let fbClientSecretId = config.get('application.facebookIds.clientSecretId');
    let googlePlusClientId = config.get('application.googlePlusIds.clientId');
    let googlePlusClientSecretId = config.get('application.googlePlusIds.clientSecretId');


    passport.use(new BearerStrategy(function (token: any, done: any) {
      let decoded: any = null;
      let isShareApi: boolean = false;
      try {
        decoded = jwt.decode(token, ConstVariables.AUTHENTICATION_JWT_KEY);
      } catch (e) {
        let err = new Error();
        err.message = Messages.MSG_ERROR_INVALID_TOKEN;
        return done(err, false, null);
      }
      if (decoded.shareKey === ConstVariables.AUTHENTICATION_ENCODED_SHARE_KEY) {
        isShareApi = true;
      } else {
        if (decoded.exp === undefined) {
          console.log('its an unsubscribed call in AuthInterceptor');
        } else if (decoded.exp <= Date.now()) {
          let err = new Error();
          err.message = Messages.MSG_ERROR_TOKEN_SESSION;
          return done(err, false, null);
        }
      }

      if (decoded.iss !== undefined) {
        let userRepository: UserRepository = new UserRepository();
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
      },

      // facebook will send back the tokens and profile
      function (access_token: any, refresh_token: any, profile: any, done: any) {
        process.nextTick(function () {
          // find the user in the database based on their facebook id
          let userRepository: UserRepository = new UserRepository();
          let query = {'email': profile.emails[0].value};
          userRepository.retrieve(query, function (err, user) {

            if (err) {
              return done(err, null);
            }
            // if the user is found, then log them in
            if (user.length > 0) {

              return done(null, user[0]);
            } else {
              // if there is no user found with that facebook id, create them

              if (profile.emails[0].value) {
                let newUser: any = <UserModel>{};

                newUser.first_name = profile.name.givenName;
                newUser.last_name = profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.mobile_number = 12345678;
                newUser.password = '12345678';
                newUser.current_theme = 'container-fluid light-theme';

                // save our user to the database
                let userRepository: UserRepository = new UserRepository();
                userRepository.create(newUser, (err: any, res: any) => {
                  if (err) {
                    return done(err, null);
                  } else {
                    return done(null, res);
                  }
                });
              } else {
                return done(null, null, true);
              }
            }
          });
        });
      }));

    passport.use(new GooglePlusTokenStrategy({
        clientID: googlePlusClientId,
        clientSecret: googlePlusClientSecretId,
        // passReqToCallback: true

      },

      // Google will send back the tokens and profile
      function (req: any, access_token: any, refresh_token: any, profile: any, done: any) {
        process.nextTick(function () {
          // find the user in the database based on their facebook id
          let userRepository: UserRepository = new UserRepository();
          let query = {'email': profile.emails[0].value};
          userRepository.retrieve(query, function (err, user) {

            if (err) {
              return done(err, null);
            }
            // if the user is found, then log them in
            if (user.length > 0) {

              return done(null, user[0]);
            } else {
              // if there is no user found with that google id, create them

              if (profile.emails[0].value) {
                let newUser: any = <UserModel>{};
                let randomMobileNumber = Math.floor(Math.random() * (10000000000 - 100000) + 1000000000);
                newUser.first_name = profile.name.givenName;
                newUser.last_name = profile.name.familyName;
                //newUser.email = profile.emails[0].value;
                newUser.email = profile.emails[0].value;
                newUser.mobile_number = randomMobileNumber;
                newUser.password = 'YH8n@4Sjj!tYk4q-';

                // save our user to the database
                let userRepository: UserRepository = new UserRepository();
                userRepository.create(newUser, (err: any, res: any) => {
                  if (err) {
                    return done(err, null);
                  } else {
                    return done(null, res);
                  }
                });
              } else {
                return done(null, null, true);
              }
            }
          });
        });
      }));
  }

  issueTokenWithUid(user: any, role?: string) {
    let issuer: string;
    if (user.userId) {
      issuer = user.userId;
    } else {
      issuer = user._id;
    }
    let curDate = new Date();
    // expires in 60 days
    let expires = new Date(curDate.getTime() + (60 * 24 * 60 * 60 * 1000)); //(day*hr*min*sec*milisec)
    let token = jwt.encode({
      iss: issuer, // issue
      exp: expires.getTime(), // expiration time
      role: role
    }, ConstVariables.AUTHENTICATION_JWT_KEY);
    return token;
  }

  issueTokenWithUidForShare(user: any) {
    //Token with no expiry date
    let issuer: string;
    let customKey: string = ConstVariables.AUTHENTICATION_ENCODED_SHARE_KEY;
    if (user.userId) {
      issuer = user.userId;
    } else {
      issuer = user._id;
    }
    let token = jwt.encode({
      iss: issuer, // issue
      shareKey: customKey
    }, ConstVariables.AUTHENTICATION_JWT_KEY);

    return token;
  }

  requiresAuth(req: any, res: any, next: any) {
    passport.authenticate('bearer', {session: false},
      function (err: any, myuser: any, isShareApi: boolean) {
        if (err) {
          next({
              reason: err.message,
              message: err.message,
              stackTrace: new Error(),
              code: 401
            }
          );
        } else {
          if (req.headers.authorization) {
            if (req.headers.authorization.split(' ')[0].toLowerCase() !== 'bearer' || req.headers.authorization.split(' ').length !== 2) {
              next({
                  reason: Messages.MSG_ERROR_IS_BEARER,
                  message: Messages.MSG_ERROR_IS_BEARER,
                  stackTrace: new Error(),
                  code: 401
                }
              );
            } else {
              if (!myuser) {
                next({
                    reason: Messages.MSG_ERROR_INVALID_TOKEN_2,
                    message: Messages.MSG_ERROR_INVALID_TOKEN_2,
                    stackTrace: new Error(),
                    code: 401
                  }
                );
              } else {
                req.user = myuser;
                (isShareApi) ? req.isShareApi = true : req.isShareApi = false;
                next();
              }
            }

          } else {
            next({
              reason: Messages.MSG_ERROR_TOKEN_NOT_PROVIDED,
              message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
              stackTrace: new Error(),
              code: 401
            });
          }
        }
      })(req, res, next);
  }

  facebookAuth(req: any, res: any, next: any) {
    passport.authenticate('facebook-token', {scope: ['email']},
      (err: any, user: any, info: any) => {

        if (err) {
          next(err);
        } else if (info) {
          next({
            reason: Messages.MSG_ERROR_FACEBOOK_AUTH,
            message: Messages.MSG_ERROR_RSN_NOT_ALLOW,
            stackTrace: new Error(),
            code: 401
          });
        } else if (user) {
          req.user = {'email': user.email, 'password': user.password};
          next();
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_FACEBOOK_AUTH,
            stackTrace: new Error(),
            code: 401
          });

        }
      })(req, res, next);
  }

  googleAuth(req: any, res: any, next: any) {
    let request = require('request');
    request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.googleToken, (error: any, response: any, body: any) => {
      if (error) {
        if (error.code === 'ETIMEDOUT') {
          next({
            reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
            message: Messages.MSG_ERROR_CONNECTION_TIMEOUT,
            stackTrace: new Error(),
            code: 401
          });

        }
      } else if (response) {
        if (!error && response.statusCode === 200) {
          let goolePlusObject = JSON.parse(body);
          let userRepository: UserRepository = new UserRepository();
          let query = {'email': goolePlusObject.email};
          userRepository.retrieve(query, (err, user) => {
            if (err) {
              next(err);
            } else if (user.length > 0) {
              if (user[0].social_profile_picture) {
                req.user = {'email': user[0].email, 'password': user[0].password};
                next();
              } else {
                let query = {'email': user[0].email};
                let updateData = {'social_profile_picture': goolePlusObject.picture};
                let userRepository: UserRepository = new UserRepository();
                userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
                  if (error) {
                    next(error);
                  } else {
                    req.user = {'email': user[0].email, 'password': user[0].password};
                    next();
                  }
                });
              }
            } else if (user.length === 0) {
              let newUser: any = <UserModel>{};
              let randomMobileNumber = Math.floor((Math.random() * 99999) + 100000);
              newUser.first_name = goolePlusObject.given_name;
              newUser.last_name = goolePlusObject.family_name;
              newUser.email = goolePlusObject.email;
              newUser.mobile_number = randomMobileNumber;
              newUser.password = 'YH8n@4Sjj!tYk4q-';
              newUser.current_theme = 'container-fluid light-theme';
              newUser.social_profile_picture = goolePlusObject.picture;
              newUser.isActivated = true;

              let userRepository: UserRepository = new UserRepository();
              userRepository.create(newUser, (err: any, res: any) => {
                if (err) {
                  next(err);
                } else if (res) {
                  req.user = {'email': res.email, 'password': res.password};
                  next();
                }
              });
            }
          });
        }
      }
    });
  }

  secureApiCheck(req: any, res: any, next: any) {
    if (req.isShareApi) {
      next({
        reason: Messages.MSG_ERROR_API_CHECK,
        message: Messages.MSG_ERROR_API_CHECK,
        stackTrace: new Error(),
        code: 401
      });
    } else {
      next();
    }
  }

  validateAdmin(req: any, res: any, next: any) {
    if (req.user.isAdmin) {
      next();
    } else {
      next({
        reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
        message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
        stackTrace: new Error(),
        code: 401
      });
    }
  }
}
Object.seal(AuthInterceptor);
export = AuthInterceptor;
