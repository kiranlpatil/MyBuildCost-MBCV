import constants = require('./constants');

export class CommonService {

  floatingPointCalculation(value : number) {
    return parseFloat((value).toFixed(constants.NUMBER_OF_FRACTION_DIGIT));
  }

}
