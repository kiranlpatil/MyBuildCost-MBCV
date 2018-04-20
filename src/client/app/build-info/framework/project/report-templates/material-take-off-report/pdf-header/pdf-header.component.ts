import { Component, Input, OnInit } from '@angular/core';
import { MaterialTakeOffElements, PDFReportHeaders, ProjectElements, SessionStorage} from '../../../../../../shared/constants';
import { SessionStorageService } from '../../../../../../shared/services/session.service';

@Component({
  moduleId: module.id,
  selector: 'bi-pdf-header',
  templateUrl: 'pdf-header.component.html',
})

export class PdfHeaderComponent implements OnInit {

  @Input() buildingName : string;
  @Input() elementType : string;
  @Input() elementName : string;

  companyName : string;
  projectName : string;
  public generatedDate: Date = new Date();

  ngOnInit() {
    this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this.companyName = SessionStorageService.getSessionValue(SessionStorage.COMPANY_NAME);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  getPDFReportHeaders() {
    return PDFReportHeaders;
  }

  getProjectElements() {
    return ProjectElements;
  }
}

