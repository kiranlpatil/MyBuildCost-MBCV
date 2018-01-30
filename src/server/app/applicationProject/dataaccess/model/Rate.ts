import RateItem = require('./RateItem');

class Rate {
  total : number;
  quantity: number;
  item: Array<RateItem>;
  constructor() {
    this.total = 0;
    this.quantity = 0;
    this.item = new Array<RateItem>();
  }
}
export = Rate;
