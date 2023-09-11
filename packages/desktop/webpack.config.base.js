/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import { dependencies as externals } from './app/package.json';
import { dependencies as possibleExternals } from './package.json';

const rootNodeModules = '../../node_modules';
const localNodeModules = './node_modules';

// Find all the dependencies without a `main` property and add them as webpack externals
function filterDepWithoutEntryPoints(dep) {
  // Return true if we want to add a dependency to externals
  try {
    let modulesPath = rootNodeModules;
    // If the root of the dependency has an index.js, return true
    if (fs.existsSync(`${rootNodeModules}/${dep}/index.js`)) {
      return false;
    }
    if (!fs.existsSync(`${rootNodeModules}/${dep}/package.json`)) {
      modulesPath = localNodeModules;
    }
    const pgkString = fs.readFileSync(`${modulesPath}/${dep}/package.json`).toString();
    const pkg = JSON.parse(pgkString);
    const fields = ['main', 'module', 'jsnext:main', 'browser'];
    return !fields.some(field => field in pkg);
  } catch (e) {
    console.log(e);
    return true;
  }
}

export default {
  externals: [
    ...['pg', 'pg-hstore'], // sequelize backend
    ...Object.keys(externals || {}),
    ...Object.keys(possibleExternals || {}).filter(filterDepWithoutEntryPoints),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            rootMode: 'upward',
          },
        },
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules'],
    alias: {
      Shared: path.resolve(__dirname, '../shared/'),
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
