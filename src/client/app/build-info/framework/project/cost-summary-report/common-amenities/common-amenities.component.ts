import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headings, TableHeadings } from '../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
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

}


