class CostControllException extends Error {
  private _cause: Error;
  private _httpStatus: number;
  get cause(): Error {
    return this._cause;
  }

  set cause(value: Error) {
    this._cause = value;
  }

  get httpStatus(): number {
    return this._httpStatus;
  }

  set httpStatus(value: number) {
    this._httpStatus = value;
  }
  constructor(message: string, cause: Error, httpStatus?:number) {
    super(message);
    this._cause = cause;
    this._httpStatus = httpStatus;
  }
  errorDetails() {
    let errorMessage = this.message;
    let httpStatus = null;
    let causeStack = this.message;
    if(this.cause) {
      causeStack = this.cause.stack;
    }
    if(this.httpStatus) {
      httpStatus = this.httpStatus;
    }
    let error = {
      message : errorMessage,
      cause: causeStack,
      status: httpStatus
    }
    return error;
  }
}
export = CostControllException;

