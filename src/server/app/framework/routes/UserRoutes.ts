/**
 * Created by chetan on 21/11/16.
 */
import * as express from "express";


let router = express.Router();
class UserRoutes {


  constructor() {

  }

  get routes() {

    router.post("login", function (req, res) {
      console.log("serving request");
      res.status(200).send({message: "done"});
    });
    return router;
  }


}

Object.seal(UserRoutes);
export = UserRoutes;
