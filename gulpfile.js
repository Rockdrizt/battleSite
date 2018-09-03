
// DEPENDENCIAS DE GULP

var gulp = require('gulp'),
  obfuscate = require('gulp-javascript-obfuscator'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  htmlmin = require('gulp-htmlmin'),
  shell = require('gulp-shell'),
  file = require('gulp-file'),
  path = require('path'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  watch = require('gulp-watch'),
  cleanCSS = require('gulp-clean-css'),
  dom = require('gulp-dom');

// VARIABLES GLOBALES

var _TOURNAMENT = {
  SERVER : {
    PORT : 3004,
    BASE_DIR : "../MathTournament",
    START_PATH : "src/sections/battle/index.html"
  },
  FILE_WATCH : [
    '.html',
    '.js',
    '.css'
  ],
  PROD_MODE : {
    JS : true,
    JS_SINGLE : true,
    JS_SINGLE_SCRIPTS : [
        "src/battle/js/main.js",
        "src/battle/js/scenes/playground.js",
        "src/battle/js/scenes/preload.js",
        "src/battle/js/libs/spineLoader.js"
    ],
    CSS : true
  },
  ROUTES : {
    MIN_JS : {
      NAME :  "script",
      SUFIX : "min"
    },
    MIN_CSS : {
      NAME :  "styles",
      SUFIX : "min"
    },
    DIST : {
      HTML : "dist",
      JS : "js",
      CSS : "css"
    },
    SRC : {
      HTML : "src",
      JS : "js",
      CSS : "css"
    }
  },
  FILE_EXCEPTIONS : {
    CSS : [
      'dist/*',
      './node_modules/**'
    ],
    JS : [
      'dist/*',
      './node_modules/**',
      'gulpfile.js',
    ],
    CLONE : [
      'gulpfile.js',
      './dist/',
      './dist/**',
      '**/dist/',
      './node_modules/',
      './node_modules/**',
      'package.json',
      './src/js/**',
      './src/css/index.css'
    ]
  },
  BASE_CONFIG: {
    FOLDERS : "dist src/battle/css src/battle/js src/battle/images",
    FILES : ["src/battle/index.html", "src/battle/js/main.js", "src/battle/css/index.css"]
  },
  DEPENDENCIES : {
    OBFUSCATE : {
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false
    }
  }
}

//
//FUNCIONES AUXILIARES
//

/**
 * Inicia las carpetas y archivos base segun la
 * configuracion
 */

var initBaseProject = function(){
  initBaseDirectories();
  for (var i = 0; i < _TOURNAMENT.BASE_CONFIG.FILES.length; i++) {
    var path = "",
    name = _TOURNAMENT.BASE_CONFIG.FILES[i];
    if (_TOURNAMENT.BASE_CONFIG.FILES[i].includes("/")) {
      path = _TOURNAMENT.BASE_CONFIG.FILES[i].substring(0, _TOURNAMENT.BASE_CONFIG.FILES[i].lastIndexOf("/")+1);
      name = _TOURNAMENT.BASE_CONFIG.FILES[i].substring(_TOURNAMENT.BASE_CONFIG.FILES[i].lastIndexOf("/")+1, _TOURNAMENT.BASE_CONFIG.FILES[i].length);
    }
    initBaseFile(name, path);
  }
}

/**
 * Inicia los archivos base segun la
 * configuracion
 */

var initBaseFile = function(name, path){
  return file(name, "//void", { src: true })
    .pipe(gulp.dest(path));
}

/**
 * Inicia las carpetas base segun la
 * configuracion
 */

var initBaseDirectories = function(){
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'mkdir -p ' + _TOURNAMENT.BASE_CONFIG.FOLDERS
    ]));
}

/**
 * Remplaza los scripts que estén referenciados en la carpeta js/
 * y coloca un script con referencia al script de distribución.
 */

var replaceScripts = function(){
  var scripts = this.querySelectorAll('script[src^="'+_TOURNAMENT.ROUTES.SRC.JS+'"]'),
  i = scripts.length,
  j = -1,
  tempNames = [];
  if (_TOURNAMENT.PROD_MODE.JS_SINGLE) {
    while(i--) {
      removeNode(scripts[i]);
    }
    var lib = this.createElement('script');
      lib.setAttribute('src', 'js/'+_TOURNAMENT.ROUTES.MIN_JS.NAME+'.'+_TOURNAMENT.ROUTES.MIN_JS.SUFIX+'.js');
      this.body.appendChild(lib);
    return this;
  }
  else{
    while(j++ <  i-1) {
      var src = scripts[j].getAttribute('src'),
      path = src.substring(0, src.lastIndexOf('/')+1);
      name = src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('.js'));
      if (!src.includes('.min')) {
        var lib = this.createElement('script');
        lib.setAttribute('src', path+name+'.'+_TOURNAMENT.ROUTES.MIN_JS.SUFIX+'.js');
        scripts[j].parentNode.insertBefore(lib, scripts[j].nextSibling);
        removeNode(scripts[j]);
      }
      else{
        // console.log("El archivo : " + name + "ya está minificado");
      }
    }
    return this;
  }

}

/**
 * Remplaza los links que estén referenciados en la carpeta css/
 * y coloca un link con referencia al css de distribución.
 */

var replaceCss = function(){
  var references = this.querySelectorAll('link[href^="'+_TOURNAMENT.ROUTES.SRC.CSS+'"]'),
  i = references.length,
  j = -1,
  tempNames = [];
  while(j++ <  i-1) {
    var href = references[j].getAttribute('href'),
    path = href.substring(0, href.lastIndexOf('/')+1);
    name = href.substring(href.lastIndexOf('/')+1, href.lastIndexOf('.css'));
    if (!href.includes('.min')) {
      var lib = this.createElement('link');
      lib.setAttribute('href', path+name+'.'+_TOURNAMENT.ROUTES.MIN_CSS.SUFIX+'.css');
      lib.setAttribute('rel', 'stylesheet');
      references[j].parentNode.insertBefore(lib, references[j].nextSibling);
      removeNode(references[j]);
    }
    else{
      // console.log("El archivo : " + name + "ya está minificado");
    }
  }
  return this;
}


/**
 * Remueve un nodo del DOM
 * @param  {DOMNode} node Nodo a remover
 * @return {void}
 */

var removeNode = function(node) {
  var parent = node.parentNode;
  parent.removeChild(node);
}

//
//GULP TASKS
//

/**
 * Inicia el proyecto base y sus carpetas y archivos
 */

gulp.task('initBaseProject', function(){
  initBaseProject();
});

/**
 * Copia todos los archivos del proyecto original en la carpeta
 * de distribución salvo los que estén definidos en las
 * excepciones globales.
 */

gulp.task('cloneFiles', function(){
  console.log('CLONANDO');
  var conditions = [_TOURNAMENT.ROUTES.SRC.HTML+'/**/*'];
  for (var i = 0; i < _TOURNAMENT.FILE_EXCEPTIONS.CLONE.length; i++) {
    conditions.push("!"+_TOURNAMENT.FILE_EXCEPTIONS.CLONE[i]);
  }
  return gulp.src(conditions)
    .pipe(rename(function(path){
    }))
    .pipe(gulp.dest(_TOURNAMENT.ROUTES.DIST.HTML));
});

/**
 * Junta todos los archivos js en un solo archivo
 * ofuscado y minificado.
 */

gulp.task('prepareJsToDist', function(){
  console.log('PREPARANDO JS');
  var conditions = [];
  for (var i = 0; i < _TOURNAMENT.FILE_EXCEPTIONS.JS.length; i++) {
    conditions.push("!" + _TOURNAMENT.FILE_EXCEPTIONS.JS[i]);
  }
  if (_TOURNAMENT.PROD_MODE.JS_SINGLE) {
    console.log("SINGLE SCRIPT MODE");
    for (var i = 0; i < _TOURNAMENT.PROD_MODE.JS_SINGLE_SCRIPTS.length; i++) {
      conditions.push(_TOURNAMENT.PROD_MODE.JS_SINGLE_SCRIPTS[i]);
    }
    console.log(conditions);
    console.log("./"+_TOURNAMENT.ROUTES.DIST.HTML+"/"+_TOURNAMENT.ROUTES.DIST.JS);
    return gulp.src(conditions)
      .pipe(gulpif(_TOURNAMENT.PROD_MODE , obfuscate(_TOURNAMENT.DEPENDENCIES.OBFUSCATE)))
      .pipe(gulpif(_TOURNAMENT.PROD_MODE, rename(function(path){
        if (!path.basename.includes('.min')) {
          console.log("ARCHIVOOOOOO : " + path.basename);
          path.extname = ".min.js";
        }
        console.log(path.extname);
      })))
      .pipe(concat(_TOURNAMENT.ROUTES.MIN_JS.NAME+"."+_TOURNAMENT.ROUTES.MIN_JS.SUFIX+'.js'))
      .pipe(gulp.dest("./"+_TOURNAMENT.ROUTES.DIST.HTML+"/"+_TOURNAMENT.ROUTES.DIST.JS));
  }
  else{
    conditions.push(_TOURNAMENT.ROUTES.SRC.HTML+"/"+_TOURNAMENT.ROUTES.SRC.JS+'/**/*.js');
    return gulp.src(conditions)
      .pipe(gulpif(_TOURNAMENT.PROD_MODE , obfuscate(_TOURNAMENT.DEPENDENCIES.OBFUSCATE)))
      .pipe(gulpif(_TOURNAMENT.PROD_MODE, rename(function(path){
        if (!path.basename.includes('.min')) {
          console.log("ARCHIVOOOOOO : " + path.basename);
          path.extname = ".min.js";
        }
      })))
      .pipe(gulp.dest("./"+_TOURNAMENT.ROUTES.DIST.HTML+"/"+_TOURNAMENT.ROUTES.DIST.JS));
  }


});

/**
 * Minifica el css.
 */

gulp.task('prepareCssToDist', function(){
  console.log('PREPARANDO CSS');
  var conditions = [_TOURNAMENT.ROUTES.SRC.HTML+"/"+_TOURNAMENT.ROUTES.SRC.CSS+'/**/*.css'];
  for (var i = 0; i < _TOURNAMENT.FILE_EXCEPTIONS.CSS.length; i++) {
    conditions.push("!"+_TOURNAMENT.FILE_EXCEPTIONS.CSS[i]);
  }
  return gulp.src(conditions)
    .pipe(gulpif(_TOURNAMENT.PROD_MODE, cleanCSS(_TOURNAMENT.DEPENDENCIES.CLEAN_CSS)))
    .pipe(gulpif(_TOURNAMENT.PROD_MODE, rename(function(path){
      if (!path.basename.includes('.min')) {
        path.extname=".min.css";
      }
    })))
    .pipe(gulp.dest("./"+_TOURNAMENT.ROUTES.DIST.HTML+"/"+_TOURNAMENT.ROUTES.DIST.CSS));
});

/**
 * Cambia las referencias a los scripts que se
 * minificaron/ofuscaron/concatenaron y la reemplaza
 * por una referencia al archivo ya editado
 */

gulp.task('changeHtmlReference', ['prepareJsToDist', 'prepareCssToDist', 'cloneFiles'], function () {
  console.log('CAMBIANDO REFERENCIA HTML');
  return gulp.src(_TOURNAMENT.ROUTES.SRC.HTML+'/*.html')
    .pipe(dom(replaceScripts))
    .pipe(dom(replaceCss))
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(_TOURNAMENT.ROUTES.DIST.HTML));
})

/**
 * Permite construir la base de carpetas desde la
 * terminal
 */

gulp.task('base', function () {
  if(!fs.existsSync(_TOURNAMENT.ROUTES.DIST.HTML)){
    console.log('INICIANDO ESTRUCTURA BASE...');
    gulp.start('initBaseProject');
  }
})

/**
 * Permite hacer el minificado/ofuscado/ desde la
 * terminal
 */

gulp.task('build', function () {
  if(fs.existsSync(_TOURNAMENT.ROUTES.DIST.HTML)){
    console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
    gulp.start('changeHtmlReference');
  }
})

/**
 * Actualiza el navegador y genera los archivos
 * de distribucion.
 */

gulp.task('updateServer', function(done) {
  console.log('RECARGANDO...');
  browserSync.reload();
  //gulp.start('changeHtmlReference');
  done();
});

/**
 * Inicia el servidor en el puerto indicado en al configuracion
 * e inicia el escuchador de eventos para cambios en los archivos.
 */

gulp.task('initServer', function(done) {
  var conditions = [];
  for (var i = 0; i < _TOURNAMENT.FILE_WATCH.length; i++) {
    conditions.push(_TOURNAMENT.ROUTES.SRC.HTML+"/**/*"+_TOURNAMENT.FILE_WATCH[i]);
  }
  browserSync.init({
    port : _TOURNAMENT.SERVER.PORT,
    startPath: _TOURNAMENT.SERVER.START_PATH,
    server: {
      baseDir: _TOURNAMENT.SERVER.BASE_DIR
      // baseDir: _QUANTRIX.ROUTES.SRC.HTML
    }
  });
  console.log('ESCUCHANDO CAMBIOS...');
  gulp.watch(conditions, ['updateServer']);
});


//Gulp principal task.

gulp.task('default', function () {
  // if(!fs.existsSync(_TOURNAMENT.ROUTES.DIST.HTML)){
  //   console.log('INICIANDO ESTRUCTURA BASE...');
  //   gulp.start('initBaseProject');
  //   gulp.start('initServer');
  // }
  // else{
    console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
    gulp.start('initServer');
  // }
})
