import Messages=require('../../../shared/messages');


class ReportInterceptor {
  public static validateProjectId(projectId: string,  callback: (error: any, result: any) => void) {
    if ((projectId === undefined) || (projectId === '')) {
      callback(null, false);
    } else callback(null, true);
  }

  constructor() {
  }

  getMaterialDetails(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ReportInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        }
        next();
      }
    });
  }

  getMaterialFilters(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ReportInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        }
        next();
      }
    });
  }

  getMaterialTakeOffReport(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ReportInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        if((req.body.element === null || req.body.element === undefined) ||
          (req.body.elementWiseReport === null || req.body.elementWiseReport === undefined) ||
          (req.body.building === null || req.body.building === undefined)) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          next(error);
        }
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        }
        next();
      }
    });
  }
}export = ReportInterceptor;
