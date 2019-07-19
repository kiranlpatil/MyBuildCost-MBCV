import Messages=require('../shared/messages');

class ContactUsInterceptor {

  constructor() {

  }

  sendMail(req: any, res: any, next: any) {

    if ((req.body.emailId === '') || (req.body.contactNumber === '') || (req.body.companyName === '') || (req.body.type === '')) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 401
      });
    } else if ((req.body.emailId === undefined) || (req.body.contactNumber === undefined) || (req.body.comapnyName === undefined) ||
      (req.body.type === undefined)) {

      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_FIELD_VERIFICATION,
        stackTrace: new Error(),
        code: 400
      });
    }
  }
}
  export = ContactUsInterceptor;
