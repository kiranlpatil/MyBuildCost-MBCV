  import * as gulp from "gulp";
import {join} from "path";
import Config from "../../config";


// TODO There should be more elegant to prevent empty directories from copying
var onlyDirs = function (es:any) {
  return es.map(function (file:any, cb:any) {
    if (file.stat.isFile()) {
      return cb(null, file);
    } else {
      return cb();
    }
  });
};
/**
 * Executes the build process, copying the config located in `config` (at root) over to the appropriate
 * `dist/prod/config` directory.
 */
export = () => {
  let es:any = require('event-stream');
  return gulp.src([
    join('config/', '*')
  ].concat(Config.TEMP_FILES.map((p) => {
    return '!' + p;
  })))
    .pipe(onlyDirs(es))
    .pipe(gulp.dest('dist/config'));
};
