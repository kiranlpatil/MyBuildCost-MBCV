import { BuildingReport } from './building-report';
import { AddCostHeadButton } from './showHideCostHeadButton';

class ProjectReport {
  buildings : Array<BuildingReport>;
  commonAmenities : BuildingReport;
  showHideCostHeadButtons : Array<AddCostHeadButton> = new Array<AddCostHeadButton>();
  totalAreaOfBuildings : number;

  constructor(buildings:Array<BuildingReport>, commonAmenities: BuildingReport) {
    this.buildings = buildings;
    this.commonAmenities = commonAmenities;
  }

}
export = ProjectReport;
