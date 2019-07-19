import * as express from 'express';
import AddPoolCarService = require('../services/ContactService');
import Messages = require('../shared/messages');

class ContactController {
    private localPoolCarService: AddPoolCarService;
    constructor() {
        this.localPoolCarService = new AddPoolCarService();
    }

    public createAddPoolCar(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            const poolcar = req.body;
            const poolCarService = new AddPoolCarService();
            poolCarService.createAddPoolCarData(poolcar, (error , result) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(result);
                }
            });
        } catch (e) {
            console.log('Exception in creating Poolcar Data : ', e);
        }
    }

  sendMail(req: express.Request, res: express.Response, next: any) {
    try {
      const poolCarService = new AddPoolCarService();
      let params = req.body;
      poolCarService.sendMail1(params, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
            message: Messages.MSG_ERROR_WHILE_CONTACTING,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': {'message': Messages.MSG_SUCCESS_SUBMITTED}
          });
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });

    }
  }
    public getAllAddPoolCars(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            const poolCarService = new AddPoolCarService();
            // @ts-ignore
          poolCarService.getAllAddPoolCarData((error , result) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(result);
                }
            });
        } catch (e) {
            console.log('Exception in creating PoolCar Data . ', e);
        }
    }

    public getAddPoolCarById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            const poolCarService = new AddPoolCarService();
            const carId = req.params.id;
            poolCarService.getAddPoolCarDataById(carId, (error , result) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(result);
                }
            });
        } catch (e) {
            console.log('Exception in get PoolCar data by Id.', e);
        }
    }

    public updatePoolCarById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            const poolCarService = new AddPoolCarService();
            const carId = req.params.id;
            const updatedCarBody = req.body;
            poolCarService.updateAddPoolCarData(carId, updatedCarBody, (error , result) => {
                if (error) {
                    res.send(error);
                } else {
                    res.send(result);
                }
            });
        } catch (e) {
            console.log('Exception in updating PoolCar By Id.', e);
        }
    }
}

export = ContactController;
