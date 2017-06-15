import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePath, NavigationRoutes, ProjectAsset } from '../../../shared/constants';
import { ActiveEmailService } from './activate-email.service';
import { MessageService } from '../../../shared/message.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-activate-email',
  templateUrl: 'activate-email.component.html',
  styleUrls: ['activate-email.component.css'],
})
export class ActivateEmailComponent {
  token: string;
  id: string;
  MY_LOGO_PATH: string;
  MY_TAG_LINE: string;
  UNDER_LICENCE: string;
  BODY_BACKGROUND: string;

  constructor(private _router: Router, private activatedRoute: ActivatedRoute,
              private activeService: ActiveEmailService, private messageService: MessageService) {
    this.MY_LOGO_PATH = ImagePath.MY_WHITE_LOGO;
    this.UNDER_LICENCE = ProjectAsset.UNDER_LICENECE;
    this.MY_TAG_LINE = ProjectAsset.TAG_LINE;
    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  navigateTo() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }
}
