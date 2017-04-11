import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as routes from './routes';
import * as cnextRoutes from './cnext-routes'
import * as methodOverride  from 'method-override';
import * as cors from 'cors';
import * as fs from 'fs';
var spdy = require('spdy');

var _clientDir = '../client';
var app = express();

export function init(port: number, mode: string,protocol: string) {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(methodOverride("X-HTTP-Method"));
  app.use(methodOverride("X-HTTP-Method-Override"));
  app.use(methodOverride("X-Method-Override"));
  app.use(methodOverride("_method"));
  app.use(express.static('src/'));


  /**
   * Dev Mode.
   * @note Dev server will only give for you middleware.
   */
  if (mode == 'dev') {
    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    });

    routes.init(app);
    cnextRoutes.cnextInit(app);

    let root = path.resolve(process.cwd());
    let clientRoot = path.resolve(process.cwd(), './dist/dev/client');
    app.use(express.static(root));
    app.use(express.static(clientRoot));
    var renderIndex = (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };
   app.get('/*', renderIndex);
    /**
     * Api Routes for `Development`.
     */
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
     * Static.
     */
    app.use('/js', express.static(path.resolve(__dirname, _clientDir + '/js')));
    app.use('/css', express.static(path.resolve(__dirname, _clientDir + '/css')));
    app.use('/assets', express.static(path.resolve(__dirname, _clientDir + '/assets')));

    /**
     * Spa Res Sender.
     * @param req {any}
     * @param res {any}
     */
    var renderIndex = function (req: express.Request, res: express.Response) {
      res.sendFile(path.resolve(__dirname, _clientDir + '/index.html'));
    };
    //app.get('*', function(req,res) {
    //  res.sendFile(process.cwd() + '/dist/prod/client/index.html');
    //});

    /**
     * Prevent server routing and use @ng2-router.
     */
    app.get('/*', renderIndex);
  }

  /**
   * Server with gzip compression.
   */
  //HTTP START:
  if(protocol == 'http') {
    return new Promise<http.Server>((resolve:any, reject:any) => {
      let server = app.listen(port, () => {
        var port = server.address().port;
        console.log('App is listening on port:' + port);
        resolve(server);
      });
    });
  } else {
    const options = {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt"),

      spdy: {
        protocols: ['h2']
      }
    };

    return spdy.createServer(options, app)
      .listen(port, (error:any) => {
        if (error) {
          console.error(error)
          return process.exit(1);
        } else {
          console.log('http2 Listening on port: ' + port + '.');
        }
      })
  }
};
