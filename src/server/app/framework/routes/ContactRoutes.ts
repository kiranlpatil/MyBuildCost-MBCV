import express = require('express');
import AddPoolCarController = require('../controllers/ContactController');
const router = express.Router();

class UserRoutes {

    private poolcarController: AddPoolCarController;

    constructor() {
        this.poolcarController = new AddPoolCarController();
    }

    get routes(): express.Router {
      var controller = this.poolcarController;
        router.post('/', controller.createAddPoolCar);
        //changes at 18/7
        router.post('/sendMail', controller.sendMail);
        router.get('/', controller.getAllAddPoolCars);
        router.get('/:id', controller.getAddPoolCarById);
        router.put('/:id', controller.updatePoolCarById);
       // router.delete('/:id', this.poolcarController.deletePoolCarById);
        return router;
    }
}

Object.seal(UserRoutes);
export = UserRoutes ;
