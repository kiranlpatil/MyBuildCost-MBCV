import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import LoggerService = require('./app/framework/shared/logger/LoggerService');
import * as sharedService from './app/framework/shared/logger/shared.service';
import Middlewares = require('./app/framework/middlewares/base/MiddlewaresBase');
import RateAnalysisService = require('./app/applicationProject/services/RateAnalysisService');
import UserService = require('./app/framework/services/UserService');
var log4js = require('log4js');
var config = require('config');
var compression = require('compression')

var spdy = require('spdy');
__dirname = './';
var _clientDir = '/client/dev';
var _serverDir = '/server/dev';
var app = express();
var CronJob = require('cron').CronJob;

export function init(port: number, mode: string, protocol: string, dist_runner: string) {

  var loggerConfig=config.get('logger');

  log4js.configure(loggerConfig);
  var loggerCategory =config.get('logger.levels.[all]')
  var logger=log4js.getLogger('User Controller');
  logger.info('Initialization info');
  logger.error('Initialization error');
  logger.debug('Initialization debug');

  process.on('uncaughtException', function (err:any) {
    let _loggerService: LoggerService = new LoggerService('uncaught exception Handler');
    let error= {
      reason: 'uncaught exception',
      message: err,
      stack: err.stack,
      code: 500
    };
    console.error(error);
    _loggerService.logError('Catching uncaught Exceptions. : ' +err);
    _loggerService.logError('Catching uncaught Exceptions stack : ' +err.stack);
    //sharedService.errorHandler(error);
    sharedService.mailToAdmin(error);
  });

  let syncAtEveryFifteenMinute = new CronJob('00 00 12 * * *', function() {

      let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
      rateAnalysisServices.syncAllRegions();

    }, function () {
      console.log('restart server');
    },
    true
  );
  //syncAtEveryFifteenMinute.start();


  let sendProjectExpiryWarningMail = new CronJob('00 50 23 * * *', function() {
  //let sendProjectExpiryWarningMail = new CronJob('00 00 01 * * *', function() {
      let userService : UserService = new UserService();
      let _loggerService: LoggerService = new LoggerService('uncaught exception Handler');
      userService.sendProjectExpiryWarningMails((error, success) => {
        if(error) {
          _loggerService.logError('Error in sendProjectExpiryWarningMail for users : ' +error);
        } else {
          _loggerService.logDebug('ProjectExpiryWarningMail send successfully to all users.');
        }
      });
    }, function () {
      console.log('restart server');
    },
    true
  );

  sendProjectExpiryWarningMail.start();


  let synchAllRegionsForRateAnalysis = new CronJob('00  50 01 * * *', function() {
      //let sendProjectExpiryWarningMail = new CronJob('00 00 01 * * *', function() {
      let rateAnalysisService : RateAnalysisService = new RateAnalysisService();
      let _loggerService: LoggerService = new LoggerService('uncaught exception Handler');
      _loggerService.logDebug('Starting to synch all regions from RateAnalysis');
      rateAnalysisService.syncAllRateAnalysisRegions();
    }, function () {
      console.log('restart server');
    },
    true
  );

  synchAllRegionsForRateAnalysis.start();

  //logger log4js initialization
  /*
    console.log('Logger Initialization');

   var logConfig=config.get('logger');

    console.log('Logger Initialization 1');

   var loggerLevel=config.get('logger.levels.[all]');

    console.log('Logger Initialization 2');

    var logger = log4js.getLogger(loggerLevel); // initialize the var to use.

    console.log('Logger Initialization completed');

    logger.info('This is Information Logger');
    logger.error('This is Error Logger');
    logger.debug('This is Debugger');

    console.log('Logger appended in file');*/
  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode === 'dev') {
    if (dist_runner === 'dist') {
      app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
      });

      app.use(Middlewares.configuration);

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
    } else {
      app.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        next();
      });

      /*routes.init(app);*/
      app.use(Middlewares.configuration);
      //cnextRoutes.cnextInit(app);

      let root = path.resolve(process.cwd());
      let clientRoot = path.resolve(process.cwd(), './dist/client/dev');
      app.use(express.static(root));
      app.use(express.static(clientRoot));
      _serverDir = '/dist/server/dev';
      app.use('/public', express.static(path.resolve(__dirname+ _serverDir +'/public')));
      let renderIndex = (req: express.Request, res: express.Response) => {
        _clientDir = '/dist/client/dev';
        res.sendFile(path.resolve(__dirname + _clientDir + '/index.html'));
      };
      app.get('/*', renderIndex);
      /**
       * Api Routes for `Development`.
       */
    }
  } else {
    if(dist_runner === 'dist') {
      /**
       * Prod Mode.
       * @note Prod mod will give you static + middleware.
       */

      /**
       * Api Routes for `Production`.
       */
      /*routes.init(app);*/
      /*cnextRoutes.cnextInit(app);*/
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
      app.use('/banners', express.static(path.resolve(__dirname, _clientDir + '/banners')));
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
    } else {
      /**
       * Prod Mode.
       * @note Prod mod will give you static + middleware.
       */

      /**
       * Api Routes for `Production`.
       */
      app.use(Middlewares.configuration);
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
      app.use('/banners', express.static(path.resolve(__dirname, _clientDir + '/banners')));
      app.use('/public', express.static(path.resolve(__dirname+ _serverDir+'/public')));

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
  }
  app.use(compression());
  /**
   * Server with gzip compression.
   */
  //HTTP START:
  if (protocol === 'http') {
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
      // key: fs.readFileSync('./staging.jobmosis.com.key'),
      // cert: fs.readFileSync('./staging.jobmosis.com.crt'),
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
          // return process.exit(1);
          process.exit(1);
        } else {
          console.log('http2 Listening on port: ' + port + '.');
        }
      });
  }
}
