const path = require('path');
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');

module.exports = {
    // entry: './src/index.tsx',
    entry: ['react-hot-loader/patch', './src/Framework'],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'docs/dist'),
        publicPath: "/dist/",
    },
    devServer: {
        contentBase: path.join(__dirname, "./docs/"),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        historyApiFallback: true,
        hotOnly: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new Dotenv()],
};
