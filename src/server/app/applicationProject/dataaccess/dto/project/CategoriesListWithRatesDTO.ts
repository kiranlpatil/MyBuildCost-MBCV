import Category = require('../../model/project/building/Category');


class CategoriesListWithRatesDTO {
  categories : Array<Category>;
  categoriesAmount : number;
  totalGstComponent : number;

  constructor() {
    this.categories = new Array<Category>();
    this.categoriesAmount = 0;
    this.totalGstComponent = 0;
  }
}

export  = CategoriesListWithRatesDTO;
