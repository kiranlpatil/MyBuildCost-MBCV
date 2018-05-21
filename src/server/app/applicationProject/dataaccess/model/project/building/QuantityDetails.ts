import QuantityItem = require('./QuantityItem');

class QuantityDetails {
  id : number;
  name:string;
  total: number;
  isDirectQuantity : boolean;
  quantityItems: Array<QuantityItem>;

  constructor() {
    this.id = 0;
    this.total = 0;
    this.isDirectQuantity = false;
  }
}
export = QuantityDetails;
