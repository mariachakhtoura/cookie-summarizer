const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        background: './src/background/background.ts',
        popup: './src/popup/popup.ts',
        content: './src/content/content.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: false, // This ensures type checking happens
                        compilerOptions: {
                            noEmitOnError: true // This will fail the build on TS errors
                        }
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'manifest.json',
                    to: 'manifest.json',
                },
                {
                    from: 'icons',
                    to: 'icons',
                },
                {
                    from: 'src/popup/popup.html',
                    to: 'popup.html',
                },
                {
                    from: 'src/popup/popup.css',
                    to: 'popup.css',
                },
            ],
        }),
    ],
};
