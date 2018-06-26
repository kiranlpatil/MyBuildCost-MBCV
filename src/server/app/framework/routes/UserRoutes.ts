
import express = require('express');
import UserController = require('./../controllers/UserController');
import AuthInterceptor = require('./../interceptor/auth.interceptor');
import LoggerInterceptor = require('../interceptor/LoggerInterceptor');
import UserInterceptor = require('../interceptor/UserInterceptor');
import sharedService = require('./../shared/logger/shared.service');

var router = express.Router();

class UserRoutes {
    private _userController: UserController;
    private _authInterceptor: AuthInterceptor;
    private _loggerInterceptor : LoggerInterceptor;
    private _userInterceptor : UserInterceptor;

    constructor () {
        this._userController = new UserController();
        this._authInterceptor = new AuthInterceptor();
        this._loggerInterceptor = new LoggerInterceptor();
        this._userInterceptor = new UserInterceptor();
    }
    get routes () : express.Router {

        var controller = this._userController;
        var logger = this._loggerInterceptor;
        var userInterceptor = this._userInterceptor;
        var authInterceptor = this._authInterceptor;

      //Dashboard
      router.post('/login', logger.logDetail, userInterceptor.login, controller.login);
      router.post('/forgotPassword', logger.logDetail, userInterceptor.forgotPassword, controller.forgotPassword);
      router.post('/sendMail', logger.logDetail, userInterceptor.sendMail, controller.sendMail);

      //User CRUD operations
      router.post('/', logger.logDetail, controller.create);
      router.get('/:id', logger.logDetail, userInterceptor.getById,
        authInterceptor.requiresAuth, authInterceptor.secureApiCheck, controller.retrieve);
      router.put('/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.updateDetails);
      router.put('/updatePicture/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.updatePicture);

      //Dashboard Auth
      router.post('/generateotp/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.sendOtp);
      router.put('/resetPassword/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.resetPassword);

      //User verification
      router.put('/verify/otp/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.verifyOtp);
      /*router.put('/verify/account/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck);*/
      router.put('/verify/mobileNumber/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.verifyMobileNumber);
      router.put('/verify/changedEmailId/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.verifyChangedEmailId);



      /* Check for limitation of buildings*/
      router.get('/:userId/project/:projectId/checkForLimitationOfBuilding',logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck,controller.checkForLimitationOfBuilding);





      //User settings
      router.put('/change/emailId/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.changeEmailId);
      router.put('/change/mobileNumber/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.changeMobileNumber);
      router.put('/change/password/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, userInterceptor.changePassword, controller.changePassword);

      //User Notification
      /*router.get('/notification/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.notifications);
      router.put('/notification/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.pushNotifications);

      router.put('/:id/fieldName/:fname', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.updateProfileField);
        router.post('/sendVerificationMail/:id', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.sendVerificationMail);*/

      /*router.use(sharedService.errorHandler);*/
      //Retrive list of project
      router.get('/subscription/project/:projectId', authInterceptor.requiresAuth, controller.getProjectSubscription);
      router.get('/all/project', authInterceptor.requiresAuth, controller.getProjects);
      router.get('/advertising/banners', authInterceptor.requiresAuth, controller.getAdvertisingBanner);

      /*router.get('/projectExpiry/sendmails', controller.sendProjectExpiryMails);*/

      // update subscription package
      router.put('/project/:projectId/updateSubscription', authInterceptor.requiresAuth, controller.updateSubscription);

      //assign premium package to user
      router.put('/:userId/assignPremium',authInterceptor.requiresAuth, controller.assignPremiumPackage);

      //assign subscription package
/*
      router.put('/:userId/assign/package', logger.logDetail, authInterceptor.requiresAuth,
        authInterceptor.secureApiCheck, controller.changePassword);
*/

      return router;
    }
}

Object.seal(UserRoutes);
export = UserRoutes;
