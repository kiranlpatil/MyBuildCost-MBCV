
import express = require("express");
import UserController = require("./../controllers/UserController");
import AuthInterceptor = require("./../interceptor/auth.interceptor");
import LoggerInterceptor = require("../interceptor/LoggerInterceptor");
import UserInterceptor = require("../interceptor/UserInterceptor");
import sharedService = require("./../shared/logger/shared.service");


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
      router.post("/generateotp/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.sendOtp);
      router.put("/verifyotp/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.verifyOtp);
      router.post("/login", this._loggerInterceptor.logDetail, this._userInterceptor.login, this._userController.login);
      router.post("/forgotpassword", this._loggerInterceptor.logDetail, this._userInterceptor.forgotPassword,
        this._userController.forgotPassword);
      router.put("/resetpassword/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.resetPassword);
      router.post("/", this._loggerInterceptor.logDetail,
        this._userController.create);
      router.put("/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.updateDetails);
      /*router.put("/:id/fieldname/:fname", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.updateProfileField);*/
      router.get("/:id", this._loggerInterceptor.logDetail, this._userInterceptor.retrieve,
        this._authInterceptor.requiresAuth, this._authInterceptor.secureApiCheck, this._userController.retrieve);
      router.post("/sendverificationmail/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.verificationMail);
      router.put("/verifyAccount/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.verifyAccount);
      router.put("/changeemailid/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.changeEmailId);
      router.put("/verifychangedemailid/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.verifyChangedEmailId);
      router.put("/changemobilenumber/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.changeMobileNumber);
      router.put("/verifymobilenumber/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.verifyMobileNumber);
      router.put("/changepassword/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userInterceptor.changePassword, this._userController.changePassword);
      router.post("/sendmail", this._loggerInterceptor.logDetail, this._userInterceptor.mail, this._userController.mail);
      /*router.get("/notification/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.notifications);
      router.put("/notification/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.pushNotifications);*/
      router.put("/updatepicture/:id", this._loggerInterceptor.logDetail, this._authInterceptor.requiresAuth,
        this._authInterceptor.secureApiCheck, this._userController.updatePicture);
      /*router.use(sharedService.errorHandler);*/

        return router;
    }
}

Object.seal(UserRoutes);
export = UserRoutes;
