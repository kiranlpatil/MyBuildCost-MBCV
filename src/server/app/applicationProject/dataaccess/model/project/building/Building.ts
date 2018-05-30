import CostHead = require('./CostHead');
import CentralizedRate = require('../CentralizedRate');

class Building {
  _id?:string;
  name: string;
  totalSlabArea: number;
  totalCarpetAreaOfUnit: number;
  totalSaleableAreaOfUnit: number;
  plinthArea:number;
  rates : Array<CentralizedRate>;
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
  cloneItems?:string[];
}
export = Building;
