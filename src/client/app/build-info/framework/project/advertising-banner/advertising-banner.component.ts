import { Component , OnInit } from '@angular/core';
import { AdvertisingBannerService } from './advertising-banner.service';

@Component ({
  moduleId:module.id,
  selector:'advertising-banner',
  templateUrl:'advertising-banner.component.html',
  styleUrls:['advertising-banner.component.css']
})

export class AdvertisingBannerComponent implements OnInit {
  private banners=new Array();
  constructor(private advertisingBannerService:AdvertisingBannerService) {}

  ngOnInit() {
   this.advertisingBannerService.getAdvertisingBanner().subscribe(
     data=> { this.banners=data.banners;},
     error=>console.log(error));
  }
}
