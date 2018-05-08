import { BuildingReport } from './building-report';
import  { AddCostHeadButton} from '../../../../../server/app/applicationProject/dataaccess/model/project/reports/showHideCostHeadButton';

class ProjectReport {
  buildings : Array<BuildingReport>;
  commonAmenities : BuildingReport;
  showHideCostHeadButtons : Array<AddCostHeadButton> = new Array<AddCostHeadButton>();

  constructor(buildings:Array<BuildingReport>, commonAmenities: BuildingReport) {
    this.buildings = buildings;
    this.commonAmenities = commonAmenities;
  }

}
export = ProjectReport;
