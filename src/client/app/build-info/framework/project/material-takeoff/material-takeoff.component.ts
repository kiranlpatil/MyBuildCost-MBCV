import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialTakeoffService } from './material-takeoff.service';
import { MaterialTakeOffElements } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent implements OnInit {

  projectId : string;
  groupBy : string;
  secondaryFilter : string;
  secondaryFilterHeading : string;
  building : string;

  costHeadList: Array<string>;
  materialList: Array<string>;
  buildingList: Array<string>;
  groupByList: Array<string>;
  secondaryFilterList : Array<string>;

  materialTakeOffDetails :any;

  constructor( private activatedRoute:ActivatedRoute,  private _router : Router, private materialTakeoffService : MaterialTakeoffService) {
  this.groupByList = [
      MaterialTakeOffElements.COST_HEAD_WISE, MaterialTakeOffElements.MATERIAL_WISE
    ];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.materialFiltersList(this.projectId);
  }

  materialFiltersList(projectId : string) {
    this.materialTakeoffService.materialFiltersList(projectId).subscribe(
      materialFiltersList => this.onMaterialFiltersListSuccess(materialFiltersList),
      error => this.onMaterialFiltersListFailure(error)
    );
  }


  onMaterialFiltersListSuccess(materialFiltersList : Array<string>) {
    this.extractList(materialFiltersList);
  }

  onMaterialFiltersListFailure(error : any) {
    console.log(error);
  }

  extractList(list : any) {
    this.buildingList = list.buildingList;
    this.building = this.buildingList[0];

    this.costHeadList = list.costHeadList;
    this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
    this.secondaryFilterList = this.costHeadList;
    this.secondaryFilter = this.costHeadList[0];

    this.groupBy = MaterialTakeOffElements.COST_HEAD_WISE;

    this.materialList = list.materialList;

    this.buildMaterialTakeOffDetails(this.groupBy, this.secondaryFilter, this.building);

  }

  onChangeGroupBy(groupBy : string) {
    this.groupBy = groupBy;
    if(this.groupBy === MaterialTakeOffElements.COST_HEAD_WISE) {
      this.secondaryFilterList = this.costHeadList;
      this.secondaryFilterHeading = MaterialTakeOffElements.COST_HEAD;
    } else {
      this.secondaryFilterList = this.materialList;
      this.secondaryFilterHeading = MaterialTakeOffElements.MATERIAL;
    }

    this.buildMaterialTakeOffDetails(this.groupBy, this.secondaryFilter, this.building);

  }

  onChangeSecondFilter(secondFilter : string) {
    this.secondaryFilter = secondFilter;
    this.buildMaterialTakeOffDetails(this.groupBy, this.secondaryFilter, this.building);
  }

  onChangeBuilding(building : string) {
    this.building = building;
    this.buildMaterialTakeOffDetails(this.groupBy, this.secondaryFilter, this.building);
  }

  getMaterialTakeOffElements() {
    return MaterialTakeOffElements;
  }

  buildMaterialTakeOffDetails(groupBy : string, secondaryFilter : string, building : string) {
    if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.costHeadWiseAllBuildings();
    } else if(groupBy === MaterialTakeOffElements.COST_HEAD_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.costHeadWiseSingleBuilding();
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building === MaterialTakeOffElements.ALL_BUILDINGS) {
      this.materialWiseAllBuildings();
    } else if(groupBy === MaterialTakeOffElements.MATERIAL_WISE && building !== MaterialTakeOffElements.ALL_BUILDINGS) {
      this.materialWiseSingleBuilding();
    }
  }

  costHeadWiseAllBuildings() {
    this.materialTakeOffDetails = {
      "RCC": {
        "header": "All Building",
        "secondaryView": {
          "cement": {
            "header": "1970 Bags",
            "table": {
              "headers": {
                "columnOne": "Building Name",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "Building A": {
                  "columnOne": "Building A",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Building B": {
                  "columnOne": "Building B",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Building C": {
                  "columnOne": "Building C",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }
            }
          },
          "Sand": {
            "header": "1970 Bags",
            "table": {
              "headers": {
                "columnOne": "Building Name",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "Building A": {
                  "columnOne": "Building A",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Building B": {
                  "columnOne": "Building B",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Building C": {
                  "columnOne": "Building C",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                }

              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }

            }
          }
        }

      }
    };
  }

  costHeadWiseSingleBuilding() {
    this.materialTakeOffDetails = {
      "RCC": {
        "header": "Build1",
        "secondaryView": {
          "cement": {
            "header": "3456 Bags",
            "table": {
              "headers": {
                "columnOne": "Item",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "WorkItem 1": {
                  "columnOne": "WorkItem 1",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "WorkItem 2": {
                  "columnOne": "WorkItem 2",
                  "columnTwo": 865,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "WorkItem 3": {
                  "columnOne": "WorkItem 4",
                  "columnTwo": 363,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "WorkItem 4": {
                  "columnOne": "WorkItem 4",
                  "columnTwo": 87,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                }


              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }
            }
          },
          "Sand": {
            "header": "8964 Bags",
            "table": {
              "headers": {
                "columnOne": "Item",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "WorkItem A": {
                  "columnOne": "WorkItem A",
                  "columnTwo": 63,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "WorkItem B": {
                  "columnOne": "WorkItem B",
                  "columnTwo": 78,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "WorkItem C": {
                  "columnOne": "WorkItem C",
                  "columnTwo": 54,
                  "columnThree": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                }

              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }

            }
          }
        }

      }
    };
  }

  materialWiseAllBuildings() {
    this.materialTakeOffDetails = {
      "Cement": {
        "header": "All Building",
        "secondaryView": {
          "Cement Build1 :": {
            "header": "1970 Bags",
            "table": {
              "headers": {
                "columnOne": "Item",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "Workitem A": {
                  "columnOne": "Workitem A",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Workitem B": {
                  "columnOne": "Workitem B",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Workitem C": {
                  "columnOne": "Workitem C",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }
            }
          },
          "Cement": {
            "header": "Build 2 : 1970 Bags",
            "table": {
              "headers": {
                "columnOne": "Item",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "Workitem A": {
                  "columnOne": "Workitem A",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Workitem B": {
                  "columnOne": "Workitem B",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                },
                "Workitem C": {
                  "columnOne": "Workitem C",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                }

              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }

            }
          }
        }

      }
    };
  }

  materialWiseSingleBuilding() {
    this.materialTakeOffDetails = {
      "Cement": {
        "header": "Build1",
        "secondaryView": {
          "Cement": {
            "header": "1970 Bags",
            "table": {
              "headers": {
                "columnOne": "Item",
                "columnTwo": "Quantity",
                "columnThree": "Unit"
              },
              "content": {
                "Workitem A": {
                  "columnOne": "Workitem A",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "Workitem B": {
                  "columnOne": "Workitem B",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {
                    "1st Floor": {
                      "columnOne": "1st Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "2nd Floor": {
                      "columnOne": "2nd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    },
                    "3rd Floor": {
                      "columnOne": "3rd Floor",
                      "columnTwo": 32,
                      "columnThree": "BAG"
                    }
                  }
                },
                "Workitem C": {
                  "columnOne": "Workitem C",
                  "columnTwo": 435,
                  "columnThree": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "columnOne": "Total",
                "columnTwo": 878,
                "columnThree": "BAG"
              }
            }
          }
        }
      }
    };
  }
}
