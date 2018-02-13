import { ValidationService } from '../../../shared/customvalidations/validation.service';

export class Building {
  name: string = '';
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
}
