var Messages = require("./messages");
var logger = require("./logger/logger");

export function logHandler(err: any, req: any, res: any, next: any) {
  if (err.code) {
    logger.info(err);
    console.log("***Client error = ", err);
    console.log(err.stack);

  }
  else {
    console.log("***Server error = ", err);
    logger.info(err);
    console.log(err.stack);

  }
  next(err);
};


export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code) {
    logger.info(err);
    console.log("Error Handler");
    next(err);
  } else {
    var errObject = {
      "status": Messages.STATUS_ERROR,
      "error": {
        "reason": "Internal Server Error",
        "message": "Internal Server Error",
        "code": 500
      }
    };

    var responseObject = JSON.stringify(errObject);
    logger.info(responseObject);
    console.log("responseObject in errorHandler:", responseObject);
    res.status(500).send(responseObject);

  }
};

export function clientHandler(err: any, req: any, res: any, next: any) {
  console.log("Client Handler");
  var errObject = {
    status: Messages.STATUS_ERROR,
    error: err
  };
  var responseObject = JSON.stringify(errObject);
  logger.info(responseObject);
  console.log("responseObject in client errorHandler:", responseObject);
  res.status(err.code).send(responseObject);
};
