import Messages=require('../shared/messages');

class UserInterceptor {

  constructor() {

  }

  login(req: any, res: any, next: any) {

    if (req.body.typeOfApp === 'RAapp') {
      if ((req.body.mobile_number === undefined) || (req.body.password === undefined)) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_PASSWORD,
          stackTrace: new Error(),
          code: 400
        });
      } else if ((req.body.mobile_number === '') || (req.body.password === '')) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_PASSWORD,
          stackTrace: new Error(),
          code: 400
        });
      }
    } else {
      if ((req.body.email === undefined) || (req.body.password === undefined)) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_PASSWORD,
          stackTrace: new Error(),
          code: 400
        });
      } else if ((req.body.email === '') || (req.body.password === '')) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_PASSWORD,
          stackTrace: new Error(),
          code: 400
        });
      }
    }

    next();

  }

  create(req: any, res: any, next: any) {

    if ((req.body.first_name === undefined) || (req.body.email === undefined) ||
      (req.body.password === undefined) || (req.body.last_name === undefined) || (req.body.mobile_number === undefined)) {
      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });
    } else if ((req.body.first_name === '') || (req.body.email === '') ||
      (req.body.password === '') || (req.body.last_name === '') || (req.body.mobile_number === '')) {
      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 401
      });
    }
    next();

  }

  createRecruiter(req: any, res: any, next: any) {

    if ((req.body.company_name === undefined) || (req.body.company_size === undefined) || (req.body.email === undefined) ||
      (req.body.password === undefined) || (req.body.location.country === undefined) || (req.body.location.state === undefined) ||
      (req.body.location.city === undefined) || (req.body.location.pin === undefined) || (req.body.mobile_number === undefined)) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });

    } else if ((req.body.company_name === '') || (req.body.company_size === '') || (req.body.email === '') ||
      (req.body.password === '') || (req.body.location.country === '') || (req.body.location.state === '') ||
      (req.body.location.city === '') || (req.body.location.pin === '') || (req.body.mobile_number === '')) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 401
      });

    }
    next();
  }

  changePassword(req: any, res: any, next: any) {

    if ((req.body.current_password === undefined) || (req.body.new_password === undefined )) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });

    } else if ((req.body.current_password === '') || (req.body.new_password === '')) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 400
      });

    }
    next();

  }

  getById(req: any, res: any, next: any) {
    next();
  }

  forgotPassword(req: any, res: any, next: any) {

    if ((req.body.email === undefined )) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });

    } else if ((req.body.email === '')) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 400
      });

    }
    next();
  }

  sendMail(req: any, res: any, next: any) {

    if ((req.body.first_name === '' ) || (req.body.email === '' ) || (req.body.message === '' )) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 401
      });

    } else if ((req.body.first_name === undefined ) || (req.body.email === undefined ) || (req.body.message === undefined )) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });
    }

    next();
  }

  update(req: any, res: any, next: any) {

    if (req.params._id === undefined) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });

    }
    next();
  }

  validateRegistrationStatus(req: any, res: any, next: any) {

    if ((req.params.mobileNo === undefined || req.params.mobileNo === '') &&
      (req.query.recruiterId === undefined || req.query.recruiterId === '')) {

      next({
        reason: Messages.MSG_ERROR_PROVIDE_MOBILE_NO,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });

    }
    next();
  }

}

export = UserInterceptor;
