import QuantityItem = require('./QuantityItem');

class Quantity {
  total: number;
  isEstimated : boolean;
  quantityItems: Map<string, Array<QuantityItem>> = new Map();

  constructor() {
    this.total = 0;
    this.isEstimated = false;
  }
}
export = Quantity;
