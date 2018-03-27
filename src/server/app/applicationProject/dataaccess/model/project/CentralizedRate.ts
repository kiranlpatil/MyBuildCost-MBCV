class CentralizedRate {
  itemName: string;
  originalItemName: string;
  rate: number;

  constructor(itemName : string, originalItemName:string, rate:number) {
    this.itemName = itemName;
    this.originalItemName = originalItemName;
    this.rate = rate;
  }
}
export = CentralizedRate;
