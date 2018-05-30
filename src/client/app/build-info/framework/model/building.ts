export class Building {
  _id?:string;
  name: string = '';
  totalSlabArea: number;
  totalCarpetAreaOfUnit: number;
  totalSaleableAreaOfUnit: number;
  plinthArea:number;
  totalNumOfFloors:number;
  numOfParkingFloors:number;
  carpetAreaOfParking:number;
  numOfOneBHK: number = 0;
  numOfTwoBHK: number = 0;
  numOfThreeBHK: number = 0;
  numOfFourBHK:number = 0;
  numOfFiveBHK:number = 0;
  numOfLifts: number = 0;
  cloneItems?:string[];
}
