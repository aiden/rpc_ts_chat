/**
 * @license
 * Copyright (c) Aiden.ai
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as webpack from 'webpack';
import * as path from 'path';
import * as TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default baseWebpackConfig({
  base: 'chat',
  webAppRoot: path.join(__dirname, 'client'),
  typescriptRoot: path.join(__dirname, '..'),
  apiFallback: '/chat/index.html',
  contentBase: path.join(__dirname, 'client/public'),
  proxy: {
    '/chat/api': 'http://localhost:3000',
  },
  env: 'dev',
  devPort: getPortFromEnv(),
  alias: {},
  devServerOpen: !process.env.DO_NOT_OPEN_WEB_PAGE,
});

type WebpackConfigurationWithDevServer = webpack.Configuration & {
  devServer: any;
};

type BaseWebpackOptions = {
  webAppRoot: string;
  typescriptRoot: string;
  env: 'prod' | 'dev';
  contentBase: string;
  base: string;
  alias: { [from: string]: string };
  devServerOpen: boolean;
  devPort: number | undefined;
  apiFallback: string;
  proxy: any;
};

/**
 * Get the port from the environment variable `PORT`, or `undefined` is the
 * port should be chosen randomly by the `http` library.
 */
function getPortFromEnv(): number | undefined {
  // 'random' is used, e.g., for end-to-end tests
  if (process.env.PORT === 'random') {
    return undefined;
  } else if (process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }
  return 3979;
}

function baseWebpackConfig(
  options: BaseWebpackOptions,
): WebpackConfigurationWithDevServer {
  const webAppRoot = options.webAppRoot;
  const typescriptRoot = options.typescriptRoot;
  const compilingBuiltSource = /\/build\//.test(__dirname);
  const extension = compilingBuiltSource ? 'js' : 'tsx';

  const cssRules = [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ];
  const imageRules = [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'media/[name]-[hash:8].[ext]',
            publicPath: options.base && `/${options.base}/`,
          },
        },
      ],
    },
  ];

  const allRules = [...cssRules, ...imageRules];

  const rules = compilingBuiltSource
    ? allRules
    : [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(typescriptRoot, 'tsconfig.json'),
                onlyCompileBundledFiles: true,
                transpileOnly: true,
              },
            },
          ],
          sideEffects: false,
        },
        ...allRules,
      ];

  return {
    optimization: {
      minimizer: [new TerserPlugin()],
    },

    entry: [path.join(webAppRoot, `index.${extension}`)],

    output: {
      // Output into build folder
      path: path.join(options.contentBase, options.base),
      filename: 'index.js',
    },

    context: webAppRoot,

    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    resolve: {
      alias: options.alias,
      extensions: ['.js', '.tsx', '.ts', '.scss'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.join(typescriptRoot, 'tsconfig.json'),
        }),
      ],
    },

    devtool: 'cheap-module-source-map', // https://reactjs.org/docs/cross-origin-errors.html

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],

    module: {
      rules,
    },

    stats: 'errors-only',

    devServer: {
      port: options.devPort,
      contentBase: options.contentBase,
      publicPath: '/' + options.base,
      historyApiFallback: {
        rewrites: [{ from: /.*/, to: options.apiFallback }],
      },
      compress: true,
      open: options.devServerOpen,
      openPage: options.base,
      overlay: true,
      proxy: options.proxy,
    },
  };
}
