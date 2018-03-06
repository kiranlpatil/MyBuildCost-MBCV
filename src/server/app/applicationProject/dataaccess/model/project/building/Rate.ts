import RateItem = require('./RateItem');

class Rate {
  rateFromRateAnalysis: number;
  total : number;
  quantity: number;
  unit:string;
  rateItems: Array<RateItem>;
  notes : string;
  imageURL : string;

  constructor() {
    this.total = 0;
    this.quantity = 0;
    this.rateItems = new Array<RateItem>();
    this.unit = 'sqft';
  }
}
export = Rate;
