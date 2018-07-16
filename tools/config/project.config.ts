import { join } from 'path';
import { SeedConfig } from './seed.config';
import { ImagePath } from '../../src/client/app/shared/constants';
 import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  FAV_ICON:string;
  SPLASH_SCREEN:string;
  APP_LOGO:string;


  constructor() {
    super();
     this.APP_TITLE = 'My Build Cost';
     this.FAV_ICON = ImagePath.FAV_ICON;
     this.SPLASH_SCREEN = ImagePath.BODY_BACKGROUND;
     this.APP_LOGO = ImagePath.MY_WHITE_LOGO;

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
       {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
       {src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs'},
        {src: 'bootstrap/dist/css/bootstrap.min.css', inject: true}
	 ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      // {src: `${this.APP_CLIENT_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. lodash)
     let additionalPackages: ExtendPackages[] = [
       {
       name: 'lodash',
       path: `node_modules/lodash/lodash.js`
    }];

    this.addPackagesBundles(additionalPackages);
    // Add packages (e.g. ng2-translate)
    /* let additionalPackages: ExtendPackages[] = [{
      name: 'ng2-social-share',
      // Path to the package's bundle
      path: 'node_modules/ng2-social-share',
      packageMeta: {
        defaultExtension: 'js'
      }

    }];

    this.addPackagesBundles(additionalPackages);
     */
    // Add packages (e.g. lodash)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'lodash',
    //   path: `${this.APP_BASE}node_modules/lodash/lodash.js`,
    //   packageMeta: {
    //     main: 'index.js',
    //     defaultExtension: 'js'
    //   }
    // }];
    //
    // or
    //
    // let additionalPackages: ExtendPackages[] = [];
    //
    // additionalPackages.push({
    //   name: 'lodash',
    //   path: `${this.APP_BASE}node_modules/lodash/lodash.js`,
    //   packageMeta: {
    //     main: 'index.js',
    //     defaultExtension: 'js'
    //   }
    // });
    //
    // this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
