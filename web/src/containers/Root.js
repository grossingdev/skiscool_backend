console.info("test" + __DEVTOOLS__);
if (__DEVTOOLS__) {
  console.info("test1");
  module.exports = require('./Root.dev');
} else if ((!__DEVTOOLS__) || (!window.devToolsExtension)) {
  console.info("test2");
  module.exports = require('./Root.prod');
}
