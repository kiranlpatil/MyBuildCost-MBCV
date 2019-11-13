import ItemGst = require('../mongoose/ItemGst');
import ItemGstSchema = require('../schemas/ItemGstSchema');

import RepositoryBase = require('../../../framework/dataaccess/repository/base/repository.base');


class ItemGstRepository extends RepositoryBase<ItemGst> {
  constructor() {
     super(ItemGstSchema);
 }
}

Object.seal(ItemGstRepository);
export =  ItemGstRepository;
