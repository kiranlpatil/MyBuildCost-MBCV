import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../../shared/index';
import { ImagePath } from '../../shared/constants';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  MY_LOGO: string;

  constructor(private commonService: CommonService, private loaderService: LoaderService) {
    this.MY_LOGO = ImagePath.MY_WHITE_LOGO;
  }

  ngOnInit() {
    document.body.scrollTop = 0;
  }

  ngOnDestroy() {
    // this.loaderService.stop();
  }

  goBack() {
    this.commonService.goBack();
  }
}
