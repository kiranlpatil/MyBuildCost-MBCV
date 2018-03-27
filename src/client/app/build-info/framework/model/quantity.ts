import { QuantityItem } from './quantity-item';

export class Quantity {
  total: number;
  isEstimated : boolean;
  quantityItems = new Map<string, Array<QuantityItem>>();

  constructor() {
    this.total = 0;
    this.isEstimated = false;
  }
}
