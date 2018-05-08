import QuantityItem = require('./QuantityItem');

class QuantityDetails {
  id : number;
  name:string;
  total: number;
  quantityItems: Array<QuantityItem>;

  constructor() {
    this.id = 0;
    this.total = 0;
  }
}
export = QuantityDetails;
