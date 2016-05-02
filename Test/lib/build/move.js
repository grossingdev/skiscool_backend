var copyDir = require('copy-dir');
var fs = require('fs');
copyDir.sync('./webapp/public', './dist/public');
var file = fs.readFileSync('./webapp/index.html', 'utf8').replace(/\/dist/g, '').replace(/\/webapp/g, '');
fs.writeFileSync('./dist/index.html', file);
