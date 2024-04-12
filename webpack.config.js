const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        bundle: ['./src/index.js', './src/frame2.js']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    watch: true
};