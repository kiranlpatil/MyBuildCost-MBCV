import QuantityDetails = require('./QuantityDetails');

class Quantity {
  total: number;
  isEstimated : boolean;
  isDirectQuantity : boolean;
  quantityItemDetails: Array<QuantityDetails>;

  constructor() {
    this.total = 0;
    this.isEstimated = false;
    this.isDirectQuantity = false;
    this.quantityItemDetails = new Array<QuantityDetails>();
  }
}
export = Quantity;
