import {Component, Input, OnInit} from '@angular/core';
import { CostHeadWiseSingleBuildingService } from './material-take-off-details.service';


@Component({
  moduleId: module.id,
  selector: 'bi-material-total-report',
  templateUrl: 'material-take-off-details.component.html'
})

export class CostHeadWiseSingleBuildingComponent implements OnInit {

 /* itemDetails : any[];
  materialDetails : any[];
  materialTakeOffDetails : any[];*/
  @Input() materialTakeOffDetails : any;

  ngOnInit() {

    /*this.materialTakeOffDetails = {
      "building": "Build1",
      "name": "RCC",
      "materialDetails": [
        {
          "name": "Cement",
          "itemDetails": [
            {
              "item": "Abc",
              "quantity": 12,
              "unit": "Bags"
            },
            {
              "item": "Efg",
              "quantity": 16,
              "unit": "Bags"
            },
            {
              "item": "Hij",
              "quantity": 18,
              "unit": "Bags"
            }
          ],
          "unit": "Bags",
          "total": 46
        },
        {
          "name": "Sand",
          "itemDetails": [
            {
              "item": "Xyz",
              "quantity": 34,
              "unit": "Bags"
            },
            {
              "item": "Pqr",
              "quantity": 19,
              "unit": "Bags"
            },
            {
              "item": "Stq",
              "quantity": 99,
              "unit": "Bags"
            }
          ],
          "unit": "Bags",
          "total": 152
        }
      ]
    };*/

   /* this.materialDetails = [
      {
        "name" : "Cement",
        "itemDetails" : [
          {
            "item" : "Abc",
            "quantity" : 12,
            "unit" : "Bags"
          },
          {
            "item" : "Efg",
            "quantity" : 16,
            "unit" : "Bags"
          },
          {
            "item" : "Hij",
            "quantity" : 18,
            "unit" : "Bags"
          }
        ],
        "unit" : "Bags",
        "total" : 46
      },
      {
        "name" : "Sand",
        "itemDetails" : [
          {
            "item" : "Xyz",
            "quantity" : 34,
            "unit" : "Bags"
          },
          {
            "item" : "Pqr",
            "quantity" : 19,
            "unit" : "Bags"
          },
          {
            "item" : "Stq",
            "quantity" : 99,
            "unit" : "Bags"
          }
        ],
        "unit" : "Bags",
        "total" : 152
      }
    ];*/

    /*this.itemDetails = [
      {
        "item" : "Abc",
        "quantity" : 12,
        "unit" : "Bags"
      },
      {
        "item" : "Efg",
        "quantity" : 16,
        "unit" : "Bags"
      },
      {
        "item" : "Hij",
        "quantity" : 18,
        "unit" : "Bags"
      }
    ];*/
    console.log('materialTakeOffDetails -> '+this.materialTakeOffDetails);
  }

}
