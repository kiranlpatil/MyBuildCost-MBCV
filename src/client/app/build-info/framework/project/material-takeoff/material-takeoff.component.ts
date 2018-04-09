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
                "column-one": "Building Name",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "Building A": {
                  "column-one": "Building A",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Building B": {
                  "column-one": "Building B",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Building C": {
                  "column-one": "Building C",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
              }
            }
          },
          "Sand": {
            "header": "1970 Bags",
            "table": {
              "headers": {
                "column-one": "Building Name",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "Building A": {
                  "column-one": "Building A",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Building B": {
                  "column-one": "Building B",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Building C": {
                  "column-one": "Building C",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                }

              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
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
                "column-one": "Item",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "WorkItem 1": {
                  "column-one": "WorkItem 1",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "WorkItem 2": {
                  "column-one": "WorkItem 2",
                  "column-two": 865,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "WorkItem 3": {
                  "column-one": "WorkItem 4",
                  "column-two": 363,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "WorkItem 4": {
                  "column-one": "WorkItem 4",
                  "column-two": 87,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                }


              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
              }
            }
          },
          "Sand": {
            "header": "8964 Bags",
            "table": {
              "headers": {
                "column-one": "Item",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "WorkItem A": {
                  "column-one": "WorkItem A",
                  "column-two": 63,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "WorkItem B": {
                  "column-one": "WorkItem B",
                  "column-two": 78,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "WorkItem C": {
                  "column-one": "WorkItem C",
                  "column-two": 54,
                  "column-three": "BAG",
                  "subContent":  {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                }

              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
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
                "column-one": "Item",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "Workitem A": {
                  "column-one": "Workitem A",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Workitem B": {
                  "column-one": "Workitem B",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Workitem C": {
                  "column-one": "Workitem C",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
              }
            }
          },
          "Cement": {
            "header": "Build 2 : 1970 Bags",
            "table": {
              "headers": {
                "column-one": "Item",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "Workitem A": {
                  "column-one": "Workitem A",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Workitem B": {
                  "column-one": "Workitem B",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                },
                "Workitem C": {
                  "column-one": "Workitem C",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                }

              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
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
                "column-one": "Item",
                "column-two": "Quantity",
                "column-three": "Unit"
              },
              "content": {
                "Workitem A": {
                  "column-one": "Workitem A",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "Workitem B": {
                  "column-one": "Workitem B",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {
                    "1st Floor": {
                      "column-one": "1st Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "2nd Floor": {
                      "column-one": "2nd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    },
                    "3rd Floor": {
                      "column-one": "3rd Floor",
                      "column-two": 32,
                      "column-three": "BAG"
                    }
                  }
                },
                "Workitem C": {
                  "column-one": "Workitem C",
                  "column-two": 435,
                  "column-three": "BAG",
                  "subContent": {}
                }


              },
              "footer": {
                "column-one": "Total",
                "column-two": 878,
                "column-three": "BAG"
              }
            }
          }
        }
      }
    };
  }
}
