
var fs = require('fs'),
    walk = require('walk'),
    exec = require('child_process').exec,
    path = require('path');
 
var pathBin = './node_modules/.bin/';

var comJs = path.resolve(pathBin + '/uglifyjs.cmd');
var comCss = path.resolve(pathBin + '/cleancss.cmd');
 
var toMin = function(filename) {
    var baseName = path.resolve(path.dirname(filename), path.basename(filename, '.css'));
    var ugRule = '' + comCss + ' ' + filename + ' -o ' + baseName + '.min.css';

    if(/(.js)/.test(filename) === true){
        baseName = path.resolve(path.dirname(filename), path.basename(filename, '.js'));
        ugRule = '' + comJs + ' ' + filename + ' -o ' + baseName + '.min.js -mt';
    }    
    console.log(filename);
    exec(ugRule, { encoding: ''},
        function (err, stdout, stderr) {
        if (err != null) {
           console.log('写入文件错误:' + err);
        } else {
            console.log(baseName + '.css has render.');
        }
    });
};
 
// Walker options
var walker  = walk.walk('.', { followLinks: false });
 
walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    if(/(.js|.css)$/.test(stat.name) && /(.min.js|.min.css|watch.js)$/.test(stat.name) === false) {
        (function(filename){
            toMin(filename);
            fs.watch(filename ,function(event, name){
                if(event === 'change') {
                    toMin(filename);
                }
            });
        })(root + '/' + stat.name);
    }
 
    next();
});
