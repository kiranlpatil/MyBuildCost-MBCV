let Messages = require("./messages");

class ResponseService {

  static errorMessage(reason: string, message: string, code: number) {
    let otherObject = {
      reason: reason,
      message: message,
      code: code

    };
    let sendData = otherObject;
    return sendData;
  }

  static errorMessageWithToken(reason: string, message: string, code: number, token: any) {
    let otherObject = {
      "status": Messages.STATUS_ERROR,
      "error": {
        "reason": reason,
        "message": message,
        "code": code
      },
      access_token: token
    };
    let sendData = JSON.stringify(otherObject);
    return sendData;
  }
}
export=ResponseService;
