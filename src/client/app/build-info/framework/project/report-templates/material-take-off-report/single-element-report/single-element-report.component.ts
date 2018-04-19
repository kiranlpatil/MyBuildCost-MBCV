import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders } from '../../../../../../shared/constants';
import { CommonService } from '../../../../../../shared/services/common.service';

@Component({
  moduleId: module.id,
  selector: 'bi-single-element-report',
  templateUrl: 'single-element-report.component.html',
})

export class SingleElementReportComponent {
  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  @Input() projectName : string;
  @Input() buildingName : string;
  @Input() reportData : any;
  public generatedDate: Date = new Date();

  downloadToPdf() {
       console.log('reportData single -> '+JSON.stringify(this.reportData));
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

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }
}

