const path = require('path');

module.exports = (env, argv) => {
  return {
    entry: {
      main: path.resolve('.', 'src', 'Calendar.tsx'),
    },
    devtool: argv.mode === 'production' ? 'false' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
          ],
          exclude: /node_modules/
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'public'),
      filename: 'bundle.js',
      library: 'Calendar',
      libraryTarget: 'umd'
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: '_',
      },
    },
  }
}
