const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.fallback = Object.assign(config.resolve.fallback || {}, {
        buffer: require.resolve('buffer'),
        'process/browser': false,
    })
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            // process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            'window.Buffer': ['buffer', 'Buffer'],
        })
    ])
    return config
}