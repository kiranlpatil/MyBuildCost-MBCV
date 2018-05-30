class Response {
  private _status: number;
  private _data: any;
  constructor(status: number, data: any) {
    this._data = data;
    this._status = status;
  }

  get status(): number {
    return this._status;
  }

  set status(value: number) {
    this._status = value;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}
export = Response;
