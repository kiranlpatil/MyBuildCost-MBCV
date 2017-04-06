import { join } from 'path';

import { SeedConfig } from './seed.config';
// import { ExtendPackages } from './seed.config.interfaces';
import { ImagePath } from '../../src/client/app/framework/shared/constants';

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
     this.APP_TITLE = 'C-Next-Job-Portal';
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

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
  }

}
