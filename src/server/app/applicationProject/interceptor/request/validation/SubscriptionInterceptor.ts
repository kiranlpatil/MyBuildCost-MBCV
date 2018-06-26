import Messages=require('../../../shared/messages')

class SubscriptionInterceptor {

  addSubscriptionPackage(req: any, res: any, next: any) {
    if((req.body.package === null || req.body.package === undefined) ||
      req.body.package.basePackage === null || req.body.package.basePackage === undefined) {
      next({
        reason: Messages.MSG_ERROR_EMPTY_FIELD,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 400
      });
    } else {
      next();
    }
  }

  getSubscriptionPackageByName(req: any, res: any, next: any) {
    if(req.body.basePackageName === null || req.body.basePackageName === undefined) {
      if(req.body.addOnPackageName === null || req.body.addOnPackageName === undefined) {
        next({
          reason: Messages.MSG_ERROR_EMPTY_FIELD,
          message: Messages.MSG_ERROR_EMPTY_FIELD,
          stackTrace: new Error(),
          code: 400
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
}

export = SubscriptionInterceptor;
