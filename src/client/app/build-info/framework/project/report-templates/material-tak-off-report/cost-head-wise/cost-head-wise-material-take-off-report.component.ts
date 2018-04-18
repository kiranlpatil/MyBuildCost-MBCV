import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SessionStorageService } from '../../../../../../shared/services/session.service';
import { SessionStorage } from '../../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-wise-material-take-off-report',
  templateUrl: 'cost-head-wise-material-take-off-report.component.html',
})

export class CostHeadWiseMaterialTakeOffDataReportComponent {
  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  @Input() projectName : string;
  @Input() buildingName : string;
  @Input() reportData : any;

  downloadToPdf() {
   console.log('reportData -> '+JSON.stringify(this.reportData));
         let contentDiv = document.createElement('div');
        let content = this.content.nativeElement.innerHTML;
        contentDiv.innerHTML = content;
        contentDiv.setAttribute('id','print-div');
        document.getElementById('tpl-app').style.display = 'none';
        window.document.body.appendChild(contentDiv);
        window.document.close();
        window.print();
        var elem = document.querySelector('#print-div');
        elem.parentNode.removeChild(elem);
        document.getElementById('tpl-app').style.display = 'initial';
  }
}

