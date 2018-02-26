import RateItem = require('./RateItem');

class Rate {
  rateFromRateAnalysis: any;
  total : number;
  quantity: number;
  unit:string;
  rateItems: Array<RateItem>;

  constructor() {
    this.rateFromRateAnalysis = 0;
    this.total = 0;
    this.quantity = 0;
    this.rateItems = new Array<RateItem>();
    this.unit = 'sqft';
  }
}
export = Rate;
