console.info("test" + __DEVTOOLS__);
if (__DEVTOOLS__ && window.devToolsExtension) {
  module.exports = require('./Root.dev');
} else if ((!__DEVTOOLS__) || (!window.devToolsExtension)) {
  module.exports = require('./Root.prod');
}
