import ContactUsSchema = require('../schemas/ContactSchema');
import IAddPoolCar = require('../mongoose/ContactUs');

import RepositoryBase = require('./base/repository.base');

class ContactRepository extends RepositoryBase<IAddPoolCar> {

    constructor() {
        super(ContactUsSchema);
    }

}

Object.seal(ContactUsSchema);
export = ContactRepository;
