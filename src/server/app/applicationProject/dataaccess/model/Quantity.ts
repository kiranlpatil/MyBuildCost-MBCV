import QuantityItem = require('./QuantityItem');

class Quantity {
  total: number;
  item: Array<QuantityItem>;
  constructor() {
    this.total = 0;
    this.item = new Array<QuantityItem>();
  }
}
export = Quantity;
