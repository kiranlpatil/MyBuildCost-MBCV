import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage, SessionStorageService } from '../../../shared/index';
import { Menus, NavigationRoutes, CurrentView } from '../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-project-header',
  templateUrl: 'project-header.component.html',
  styleUrls:['./project-header.component.css']
})

export class ProjectHeaderComponent implements OnInit {

  @Input() isClassVisible: boolean;
  @Output() toggleClassView = new EventEmitter<boolean>();
  @Input () isActiveAddBuildingButton?:boolean;

  constructor(private _router: Router) {
  }

  ngOnInit() {
    this.getCurrentProjectId();
  }

  getCurrentProjectId() {
    return SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
  }

  goToCreateBuilding() {
    this._router.navigate([NavigationRoutes.APP_CREATE_BUILDING]);
  }

  getMenus() {
    return Menus;
  }

  getCurrentView() {
    return SessionStorageService.getSessionValue(SessionStorage.CURRENT_VIEW);
  }

  currentView() {
    return CurrentView;
  }

  closeMenu() {
    this.toggleClassView.emit(false);
  }

}
