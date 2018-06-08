import BuildingReport = require('./BuildingReport');
import { AddCostHeadButton } from './showHideCostHeadButton';

class ProjectReport {
  buildings : Array<BuildingReport>=new Array<BuildingReport>();
  commonAmenities : Array<BuildingReport>=new Array<BuildingReport>();
  showHideCostHeadButtons : Array<AddCostHeadButton> = new Array<AddCostHeadButton>();
  totalAreaOfBuildings : number;
}
export = ProjectReport;
