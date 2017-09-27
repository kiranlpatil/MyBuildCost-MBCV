export class UtilityFunction {

    public static valueHide(value:string) {
        var result = new Array(value.length).join('X');
        return result;
    }

    public static emailValueHider(_email:string) { //TODO: use regExp
        if (_email.indexOf('@') !== -1) {
            var hideEmail = new Array(_email.split('@')[0].length).join('X');
            return _email[0].toUpperCase() + hideEmail + '@' + _email.split('@')[1];
        } else {
            return _email;
        }
    }

  public static mobileNumberHider(_mobileNumber:number) {
        var hideMobileNumber = _mobileNumber.toString()[0] + _mobileNumber.toString().substr(_mobileNumber.toString().length - 4);
        return Number(hideMobileNumber);
    }

}
