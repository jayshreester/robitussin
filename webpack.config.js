'use strict'; 

//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); 
//var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const path = require ('path');

module.exports = {
	entry: ['./src/js/index.js','./src/scss/_index.scss'],
	output: {
       path:path.resolve(__dirname, 'dist'),
		filename:'bundle.js'
    },
	resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      mainFields: ['browser', 'main', 'module']
    },
	devServer: {
    contentBase: "./dist",
    overlay: true,
    hot: true,
    port: 9000
    },
	mode:"production",
	target: 'node',
    module: {
        rules: [{
                test: [/.css$|.scss$/],
				include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
				use: [
				  MiniCssExtractPlugin.loader,
				  'css-loader',
				  {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
								require('autoprefixer')({ overrideBrowserslist: ['last 3 versions', '> 1%'] }),
							  ]
                        },
                    },
				  'sass-loader',
				],
            },
            {
                test: /\.js$/,
				include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
				use: {
                    loader: 'babel-loader',
                    options: {
						plugins: [
    "@babel/plugin-proposal-class-properties"
  ],						
                        presets: [[
							"@babel/preset-env",
							{
								"useBuiltIns": "usage", // "usage" | "entry" | false, defaults to false.
								"corejs": "2.6.11",
								"modules": false,
								"targets": {
									"esmodules": true,
									"ie": "11"
								}
							}
							]]
					}
                }
            },
			 {
                test: /\.js$/,
				include: [path.resolve(__dirname, "src")],
                exclude:/node_modules/,
                use: {
                    loader: 'eslint-loader'
                }
            },
			{
				test: /\.(png|jpg|gif)$/,
				loader: "url-loader?limit=5000&name=img/img-[hash:6].[ext]"
			}
        ]
    },
    plugins: [	
	//new LodashModuleReplacementPlugin,
	new MiniCssExtractPlugin({
		filename: 'css/bundle.css'
	})
    ]
};
