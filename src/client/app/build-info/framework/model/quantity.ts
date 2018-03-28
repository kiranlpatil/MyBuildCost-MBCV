import { QuantityDetails } from './quantity-details';

export class Quantity {
  total: number;
  isEstimated : boolean;
  quantityItemDetails = Array<QuantityDetails>();

  constructor() {
    this.total = 0;
    this.isEstimated = false;
    this.quantityItemDetails = new Array<QuantityDetails>();

  }
}
