'use strict';

const
	webpack = require('webpack'),
	path = require('path');

const entryPoint = {
	'SimpleCarousel' : './assets/javascript/SimpleCarousel.js'
};

module.exports = {
	entry : {
		'SimpleCarousel' : entryPoint.SimpleCarousel
	},
	output : {
		path : path.join(__dirname + '/assets/javascript/dist/'),
		filename : '[name].min.js'
	},
	module : {
		loaders : [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'es2016']
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true
			,comments : false
			,mangle: {
				except: ['$', 'jQuery']
			}
		})
	]
};