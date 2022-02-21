const webpack = require('webpack')

const config = {
    mode: "development",
    entry: __dirname + '/src/visualiser.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    devtool: 'inline-source-map',
};

module.exports = config;