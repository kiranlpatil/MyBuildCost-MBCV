import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ReleventIndustryListService} from "./relevent-industry-list.service";
import {Messages, Tooltip} from "../../../framework/shared/constants";
import {Section} from "../model/candidate";
import {ReleventIndustry} from "./relevent-industry";
import {Role} from "../model/role";
import {Industry} from "../model/industry";


@Component({
  moduleId: module.id,
  selector: 'cn-relevent-industry-list',
  templateUrl: 'relevent-industry-list.component.html',
  styleUrls: ['relevent-industry-list.component.css']
})

export class ReleventIndustryListComponent implements OnInit {
  releventIndustries: ReleventIndustry[] = [];
  workAreas: string[] = [];
  workAreasToUpdate: string[] = [];
  @Output() onNextComplete = new EventEmitter();
  @Output() checkReleventIndustries = new EventEmitter();
  @Input() highlightedSection: Section;
  @Input() roles: Role[] = new Array(0);
  @Input() industry: Industry;
  @Input() slectedReleventIndustry: string[] = new Array(0);
  suggestionMsgForReleventIndustry: string;
  //showRleventindustry: boolean = false;
  private showButton: boolean = true;
  private disableButton: boolean = true;


  tooltipMessage: string =
    '<ul>' +
    '<li><p>1. '+ Tooltip.RELEVENT_INDUSTRY_LIST_TOOLTIP+'</p></li>' +
    '</ul>';

  constructor(private releventIndustryService: ReleventIndustryListService) {

  }

  ngOnInit() {
    this.suggestionMsgForReleventIndustry = Messages.SUGGESTION_MSG_FOR_RELEVENT_INDUSTRY;
    this.getReleventIndustries();

  }

  ngOnChanges(changes: any) {
    if (changes.roles !== undefined && changes.roles.currentValue !== undefined) {
      this.getReleventIndustries();
    }
  }

  getReleventIndustries() {
    if (this.roles.length) {
      this.roles.forEach(x => this.workAreas.push(x.name));
      this.releventIndustryService.getReleventIndustries(this.workAreas, this.industry.name)
        .subscribe(
          res => {
            this.onGetIndustriesSuccess(res);
          },
          error => {
            this.onError(error);
          });
    }
  }

  onGetIndustriesSuccess(res: any) {
    this.releventIndustries = new Array(0);
    this.releventIndustries = <ReleventIndustry[]>res.data;
    this.releventIndustries.forEach(x => x.isChecked = true);
    this.checkReleventIndustries.emit(res.data.length);
  }

  onError(error: any) {
    console.log('----errorr------', error);
  }

  goNext() {
    this.onNext();
    this.highlightedSection.name = 'Compentancies';
    this.onNextComplete.emit(this.workAreasToUpdate);
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onSave() {
    this.highlightedSection.name = 'none';
    this.highlightedSection.isDisable = false;
    this.onNext();
    this.onNextComplete.emit(this.workAreasToUpdate);
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  /* getReleventIndustry(event: any) {
    this.showRleventindustry = event.target.checked;
    //this.showRleventindustry = true;
    //if(event.target.checked) {
   //this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
   /!* } else {
   this.releventIndustries.forEach(x => x.isChecked = event.target.checked);
   }*!/
   }*/

  onValueChange(event: any, index: number) {
    this.releventIndustries[index].isChecked = event.target.checked;
  }

  onNext() {
    this.workAreasToUpdate = new Array(0);
    this.slectedReleventIndustry = new Array(0);
    this.releventIndustries.forEach(item => {
      if (item.isChecked) {
        this.workAreasToUpdate.push(item.name);
        this.slectedReleventIndustry.push(item.name);
      }
    });
    // this.goNext();
  }

  onPrevious() {
    this.highlightedSection.name = 'IndustryExposure';
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }

  onEdit() {
    this.highlightedSection.name = 'ReleventIndustry';
    this.showButton = false;
    this.disableButton = false;
    let _body: any = document.getElementsByTagName('BODY')[0];
    _body.scrollTop = -1;
  }
}
