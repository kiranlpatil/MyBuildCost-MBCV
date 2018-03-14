import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button, Headings, Label, TableHeadings } from '../../../../../shared/constants';
import { BuildingReport } from '../../../model/building-report';

@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
  @Input() amenitiesReport: BuildingReport;
  @Input() costingByUnit : string;
  @Input() costingByArea : string;
  projectId: string;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }

  getHeadings() {
    return Headings;
  }

  getTableHeadings() {
    return TableHeadings;
  }

  getLabel() {
    return Label;
  }
  getButton() {
    return Button;
  }

}


