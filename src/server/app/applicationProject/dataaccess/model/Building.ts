import CostHead = require('./CostHead');

class Building {
  name: string;
  totalSlabArea: number;
  totalCarperAreaOfUnit: number;
  totalSaleableAreaOfUnit: number;
  plinthArea:number;
  totalNoOfFloors:number;
  noOfParkingFloors:number;
  carpetAreaOfParking:number;
  noOfOneBHK: number;
  noOfTwoBHK: number;
  noOfThreeBHK: number;
  noOfFourBHK:number;
  noOfFiveBHK:number;
  noOfLift: number;
  costHead: Array<CostHead>;
}
export = Building;
