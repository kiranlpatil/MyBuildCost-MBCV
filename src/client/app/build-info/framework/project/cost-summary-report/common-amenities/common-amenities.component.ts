import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonAmenitiesService } from './common-amenities.service';



@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
  projectId: string;

  constructor(private commonAmenitiesService: CommonAmenitiesService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }
}


