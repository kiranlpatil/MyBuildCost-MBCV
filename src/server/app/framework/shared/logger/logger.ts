import * as winston from "winston";


let logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: "clientErrorLogs",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function (message: any, encoding: any) {
    logger.info(message);
  }
};
