import { Category } from '../../model/category';


class CategoriesListWithRatesDTO {
  categories : Array<Category>;
  categoriesAmount : number;

  constructor() {
    this.categories = new Array<Category>();
    this.categoriesAmount = 0;
  }
}

export  = CategoriesListWithRatesDTO;
