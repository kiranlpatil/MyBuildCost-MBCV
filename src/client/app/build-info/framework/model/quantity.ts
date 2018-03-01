import { QuantityItem } from './quantity-item';

export class Quantity {
  total: number;
  quantityItems: Array<QuantityItem>;

  constructor() {
    this.total = 0;
    this.quantityItems = new Array<QuantityItem>();
  }
}
