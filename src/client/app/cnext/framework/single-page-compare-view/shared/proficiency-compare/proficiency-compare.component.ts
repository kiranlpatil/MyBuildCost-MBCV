import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../shared/services/localstorage.service';
import { LocalStorage } from '../../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'cn-proficiency-compare',
  templateUrl: 'proficiency-compare.component.html',
  styleUrls: ['proficiency-compare.component.css']
})

export class ProficiencyCompareComponent implements OnInit ,OnChanges {
  @Input() data: any;
  @Input() matchdData: any = new Array(0);

  private isCandidate: string;

  ngOnInit() {
    this.isCandidate = LocalStorageService.getLocalValue(LocalStorage.IS_CANDIDATE);
  }


  ngOnChanges(changes: any) {
    if (changes.data != undefined && changes.data.currentValue != undefined) {
      this.data = changes.data.currentValue;
    }

    if (changes.matchdData != undefined && changes.matchdData.currentValue != undefined) {
      this.matchdData = changes.matchdData.currentValue;
    }

    if (this.matchdData != undefined && this.data != undefined) {
      this.sortProficiency();
    }
  }

  checkData(item: any) {
    if (this.matchdData !== undefined) {
      if (this.matchdData.indexOf(item) >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  sortProficiency() {
    for (let item of this.matchdData) {
      if (this.data.indexOf(item) != -1) {
        this.data.splice(this.data.indexOf(item), 1);
      }
    }
  }
}
