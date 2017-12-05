export class UtilityFunction {

    public static valueHide(value:string) {
      if(value) {
        let result = new Array(value.length).join('X');
        return result;
      }
      return value;
    }

    public static emailValueHider(_email:string) { //TODO: use regExp
        if (_email.indexOf('@') !== -1) {
            let hideEmail = new Array(_email.split('@')[0].length).join('X');
            return _email[0].toUpperCase() + hideEmail + '@' + _email.split('@')[1];
        } else {
            return _email;
        }
    }

  public static mobileNumberHider(_mobileNumber: number) {
    let hideMobileNumber = _mobileNumber.toString().substr(1, 4) +
      new Array((_mobileNumber.toString().substr(0, 7)).length).join('X');
    return hideMobileNumber;
  }

}
