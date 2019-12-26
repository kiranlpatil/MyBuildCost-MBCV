class CentralizedRate {
  itemName: string;
  originalItemName: string;
  rate: number;
  gst: number;

  constructor(itemName : string, originalItemName:string, rate:number, gst:number) {
    this.itemName = itemName;
    this.originalItemName = originalItemName;
    this.rate = rate;
    this.gst = gst;
  }
}
export = CentralizedRate;
