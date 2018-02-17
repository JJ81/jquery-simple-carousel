var options = {
	paths: ['./assets/javascript/SimpleCarousel.js'],
	outdir: './docs'
};

var Y = require('yuidoc');
var json = (new Y.YUIDoc(options)).run();
// console.info(json);