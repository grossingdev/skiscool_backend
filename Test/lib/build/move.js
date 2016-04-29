var copyDir = require('copy-dir');
var fs = require('fs');
copyDir.sync('./public', './dist/public');
var file = fs.readFileSync('./index.html', 'utf8').replace(/\/dist/g, '');
fs.writeFileSync('./dist/index.html', file);
