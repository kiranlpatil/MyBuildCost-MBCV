import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as compression from "compression";
import * as routes from "./routes";
import * as cnextRoutes from "./cnext-routes";
import * as methodOverride from "method-override";
import * as cors from "cors";
import * as fs from "fs";
import LoggerService = require("./app/framework/shared/logger/LoggerService");
import * as sharedService from "./app/framework/shared/logger/shared.service";
import { CronJobService } from './app/framework/services/cron-job.service';

var spdy = require('spdy');
var cronJobService=new CronJobService();
 __dirname = './';
var _clientDir = '/dist/client/dev';
var _serverDir = '/dist/server/dev';
var app = express();

export function init(port: number, mode: string, protocol: string, dist_runner: string) {
  cronJobService.OnCronJobStart();
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json({limit: '40mb'}));
  app.use(bodyParser.urlencoded({limit: '40mb', extended: true}));
  app.use(bodyParser.text());
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(methodOverride("X-HTTP-Method"));
  app.use(methodOverride("X-HTTP-Method-Override"));
  app.use(methodOverride("X-Method-Override"));
  app.use(methodOverride("_method"));
  app.use(express.static('src/'));
  process.on('uncaughtException', function (err:any) {
    let _loggerService: LoggerService = new LoggerService('uncaught exception Handler');
    let error= {
      reason: 'uncaught exception',
      message: err,
      stack: err.stack,
      code: 500
    };
    console.error(error);
    _loggerService.logError("Catching uncaught Exceptions. : " +err);
    _loggerService.logError("Catching uncaught Exceptions stack : " +err.stack);
    //sharedService.errorHandler(error);
    sharedService.mailToAdmin(error);
  });

  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode == 'dev') {
    if (dist_runner == 'dist') {
      app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
      });

      routes.init(app);
      cnextRoutes.cnextInit(app);

      let root = path.resolve(process.cwd());
      let clientRoot = path.resolve(process.cwd(), './client/dev');
      app.use(express.static(root));
      app.use(express.static(clientRoot));
      _serverDir = '/dist/server/dev';
      app.use('/public', express.static(path.resolve(__dirname + _serverDir +'/public')));
      var renderIndex = (req: express.Request, res: express.Response) => {
        _clientDir = '/client/dev';
        res.sendFile(path.resolve(__dirname + _clientDir + '/index.html'));
      };
      app.get('/*', renderIndex);
      /**
       * Api Routes for `Development`.
       */
    }
    else {
      app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
      });

      routes.init(app);
      cnextRoutes.cnextInit(app);

      let root = path.resolve(process.cwd());
      let clientRoot = path.resolve(process.cwd(), './dist/client/dev');
      app.use(express.static(root));
      app.use(express.static(clientRoot));
      _serverDir = '/dist/server/dev';
      app.use('/public', express.static(path.resolve(__dirname+ _serverDir +'/public')));
      var renderIndex = (req: express.Request, res: express.Response) => {
        _clientDir = '/dist/client/dev';
        res.sendFile(path.resolve(__dirname + _clientDir + '/index.html'));
      };
      app.get('/*', renderIndex);
      /**
       * Api Routes for `Development`.
       */
    }
  }
  else {
    if(dist_runner == 'dist') {
      /**
       * Prod Mode.
       * @note Prod mod will give you static + middleware.
       */

      /**
       * Api Routes for `Production`.
       */
      routes.init(app);
      cnextRoutes.cnextInit(app);
      /**
       * Client Dir
       */
      _clientDir = './client/prod';
      _serverDir = '/server/prod';

      /**
       * Static.
       */
      app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
      app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
      app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));
      app.use('/public', express.static(path.resolve(__dirname+ _serverDir + '/public')));

      /**
       * Spa Res Sender.
       * @param req {any}
       * @param res {any}
       */
      var renderIndex = function (req: express.Request, res: express.Response) {
        _clientDir = '/client/prod';
        res.sendFile(path.resolve(__dirname + _clientDir + '/index.html'));
      };

      //app.get('*', function(req,res) {
      //  res.sendFile(process.cwd() + '/dist/prod/client/index.html');
      //});

      /**
       * Prevent server routing and use @ng2-router.
       */
      app.get('/*', renderIndex);
    }
    else {
      /**
       * Prod Mode.
       * @note Prod mod will give you static + middleware.
       */

      /**
       * Api Routes for `Production`.
       */
      routes.init(app);
      cnextRoutes.cnextInit(app);
      /**
       * Client Dir
       */
      _clientDir = './dist/client/prod';
      _serverDir = '/dist/server/prod';

      /**
       * Static.
       */
      app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
      app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
      app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));
      app.use('/public', express.static(path.resolve(__dirname+ _serverDir+'/public')));

      /**
       * Spa Res Sender.
       * @param req {any}
       * @param res {any}
       */
      var renderIndex = function (req: express.Request, res: express.Response) {
        _clientDir = '/dist/client/prod';
        res.sendFile(path.resolve(__dirname + _clientDir + '/index.html'));
      };

      //app.get('*', function(req,res) {
      //  res.sendFile(process.cwd() + '/dist/prod/client/index.html');
      //});

      /**
       * Prevent server routing and use @ng2-router.
       */
      app.get('/*', renderIndex);
    }
  }

  /**
   * Server with gzip compression.
   */
  //HTTP START:
  if (protocol == 'http') {
    return new Promise<http.Server>((resolve, reject) => {
      let server = app.listen(port, () => {
        var port = server.address().port;
        console.log('App is listening on port:' + port);
        resolve(server);
      });
      server.timeout = 600000; //by default timeout set to 10 min for export functionality
    });
  } else {
    const options = {
      key: fs.readFileSync("./staging.jobmosis.com.key"),
      cert: fs.readFileSync("./staging.jobmosis.com.crt"),
      handshakeTimeout: 600000, //by default timeout set to 10 min for export functionality, Need to test this
      passphrase: 'tpl123',
      spdy: {
        protocols: ['h2']
      }
    };

    return spdy.createServer(options, app)
      .listen(port, (error: any) => {
        if (error) {
          console.error(error)
          return process.exit(1);
        } else {
          console.log('http2 Listening on port: ' + port + '.');
        }
      })
  }
};
