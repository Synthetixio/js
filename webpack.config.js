'use strict';
const path = require('path');

const serveConfig = {
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: ['/node_modules/'],
				use: {
					loader: 'ts-loader',
				},
			},
		],
	},
	target: 'node',
	entry: './src/index.node.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.node.js',
		library: 'synthetix',
		libraryTarget: 'commonjs',
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.js'],
	},
};

const clientConfig = {
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: ['/node_modules/'],
				use: {
					loader: 'ts-loader',
				},
			},
		],
	},
	entry: './src/index.browser.ts',
	target: 'web',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.browser.js',
		library: 'synthetix',
		libraryTarget: 'umd',
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts'],
	},
};

module.exports = [clientConfig, serveConfig];
