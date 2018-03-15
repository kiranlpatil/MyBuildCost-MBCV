import CostHead = require('./CostHead');
import RateItem = require('./RateItem');

class Building {
  _id?:string;
  name: string;
  totalSlabArea: number;
  totalCarpetAreaOfUnit: number;
  totalSaleableAreaOfUnit: number;
  plinthArea:number;
  rates : Array<RateItem>;
  totalNumOfFloors:number;
  numOfParkingFloors:number;
  carpetAreaOfParking:number;
  numOfOneBHK: number;
  numOfTwoBHK: number;
  numOfThreeBHK: number;
  numOfFourBHK:number;
  numOfFiveBHK:number;
  numOfLifts: number;
  costHeads: Array<CostHead>;
}
export = Building;
