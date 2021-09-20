const path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'eval-source-map',
    mode: 'development',
    cache: false,
    watch: true,
    output: {
        path: __dirname,
        filename: path.join('.', 'target', 'classes', 'static', 'generated', 'bundle.js')
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }]
            }
        ]
    }
};
