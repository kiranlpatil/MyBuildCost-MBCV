var Messages = require("./messages");

class ResponseService {

  static errorMessage(reason: string, message: string, code: number) {
    var otherObject = {
      reason: reason,
      message: message,
      code: code

    };
    var sendData = otherObject;
    return sendData;
  }

  static errorMessageWithToken(reason: string, message: string, code: number, token: any) {
    var otherObject = {
      "status": Messages.STATUS_ERROR,
      "error": {
        "reason": reason,
        "message": message,
        "code": code
      },
      access_token: token
    };
    var sendData = JSON.stringify(otherObject);
    return sendData;
  }
}
export=ResponseService;
