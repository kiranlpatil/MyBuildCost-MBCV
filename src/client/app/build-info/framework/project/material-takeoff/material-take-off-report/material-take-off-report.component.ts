import { Component, Input } from '@angular/core';
import { MaterialTakeOffElements } from '../../../../../shared/constants';


@Component({
  moduleId: module.id,
  selector: 'bi-material-take-off-report',
  templateUrl: 'material-take-off-report.component.html'
})

export class MaterialTakeOffReportComponent  {

  @Input() MaterialTakeOffReport : any;


  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }


}
