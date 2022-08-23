import path from "path";
/*
creer les dossier si necessaires
creer le compiled json si possible
charger le sass
*/
/*
######## utils
import path from 'path';
import fs, { Dirent } from 'fs';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

type Paths = {
  src: string;
  build: string;
  public: string;
  assets: string;
  nodeModules: string;
};

export const paths: Paths = {
  // Source files
  src: path.resolve(__dirname, '../src'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),

  // Static files that get copied to build folder
  assets: path.resolve(__dirname, '../assets'),

  // files pointing ti the node modules
  nodeModules: path.resolve(__dirname, '../node_modules'),
};

export type EnvArgs = {
  configPath?: string;
  addon?: string;
  themeFolder?: string;
  mode?: string;
};
export interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export function getAddons(addonsArgs: string | undefined | string[]) {
  const addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];

  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  return addons.filter(Boolean).map((name) => require(`./addons/addon.${name}.ts`));
}

export type CreateConfiguration = (env: EnvArgs) => Configuration;

export function checkIfDevMode(mode: string): boolean {
  return mode === 'dev';
}

export function getChosenCreateConfiguration(env: EnvArgs): Configuration {
  if (env.mode !== 'dev' && env.mode !== 'prod') {
    throw new Error(`It should be either 'dev' or 'prod'. Instead it is ${env.mode}`);
  }
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  const createConfiguration = require(`./webpack.${env.mode}.config.ts`)
    .default as CreateConfiguration;
  return createConfiguration(env);
}

type ThemeData = object;
type ThemeObject = { name: string; data: ThemeData; isDefault: boolean };
const extension: string = '.json';

function extractThemeAsThemeObject(dirent: Dirent, folderPath: string): ThemeObject | undefined {
  const filename = dirent.name;

  if (dirent.isDirectory() || !filename.endsWith(extension)) {
    return undefined;
  }

  const name = filename.slice(0, -extension.length);
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  const data = require(`${folderPath}/${filename}`) as ThemeData;

  return { name, data, isDefault: name === 'default' };
}

export async function generateConsolidatedJsonTheme(
  themeFolder: string,
  output: string
): Promise<void> {
  const themeFolderPath = `${paths.assets}/${themeFolder}`;
  const directory = await fs.promises.readdir(themeFolderPath, { withFileTypes: true });

  const rawThemeObjects = await Promise.all(
    directory.map((dirent) => extractThemeAsThemeObject(dirent, themeFolderPath))
  );

  const themeObjects = rawThemeObjects.filter((obj) => !!obj) as ThemeObject[];

  if (themeObjects.length < 2) {
    throw new Error('The directory should have at least two files: the default.json and a theme.');
  }

  const defaultObject = themeObjects.find((obj) => obj.isDefault);
  if (!defaultObject) {
    throw new Error('No default theme available');
  }

  // create our blunded theme for our style.
  const blendedData = {
    default: (
      defaultObject.data as {
        name: string;
      }
    ).name,
    themes: (themeObjects.filter((obj) => !obj.isDefault) as ThemeObject[])
      .map((th) => ({ [th.name]: th.data }))
      .reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          ...currentValue,
        }),
        {}
      ),
  };

  // dump it as the output
  await fs.promises.writeFile(output, JSON.stringify(blendedData), 'utf8');
}

export function customJsonImporter<T = Function>(themeFolder: string, output: string) {
  generateConsolidatedJsonTheme(themeFolder, output);
  // eslint-disable-next-line global-require
  const jsonImporter = require('node-sass-json-importer') as T;
  return jsonImporter;
}



####### webpack

           {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode,
                sassOptions: {
                  outputStyle: 'compressed',
                  importer: customJsonImporter(
                    `${env.themeFolder}`,
                    `${paths.src}/styles/theme/themes.json`
                  )(),
                },
              },
            },

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { merge } from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import {
  paths,
  EnvArgs,
  Configuration,
  CreateConfiguration,
  getAddons,
  checkIfDevMode,
  customJsonImporter,
} from './utils';

function createCommonConfiguration(env: EnvArgs): Configuration {
  const isDevMode = checkIfDevMode(env.mode || 'dev');
  return {
    // Where webpack looks to start building the bundle
    entry: `${paths.src}/index.tsx`,

    devtool: isDevMode ? 'source-map' : false,

    optimization: {
      usedExports: true,
    },

    // Where webpack outputs the assets and bundles
    output: {
      path: paths.build,
      filename: '[name].bundle.js',
      publicPath: '/',
      clean: true,
    },

    // Customize the webpack build process
    plugins: [
      // Removes/cleans build folders and unused assets when rebuilding
      new CleanWebpackPlugin(),

      // Copies files from target to destination folder
      new CopyWebpackPlugin({
        patterns: [
          // the public folder should become the asset one
          {
            from: paths.assets,
            to: 'assets',
          },
        ],
      }),

      // Generates an HTML file from a template
      // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
      new HtmlWebpackPlugin({
        title: 'template react sass typescript',
        // favicon: `${paths.src}/assets/favicon.png`,
        template: `${paths.src}/template.html`, // template file
        filename: `${paths.build}/index.html`, // output file
      }),

      // Load environment variables
      new Dotenv({
        path: `${env.configPath}`,
      }),

      // Check ESLint in runtime
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        emitError: true,
        emitWarning: false,
        failOnError: false,
        failOnWarning: false,
      }),

      // Check Typescript in runtime
      new ForkTsCheckerWebpackPlugin({
        async: false,
      }),
    ].concat(
      isDevMode
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
              chunkFilename: '[id].[contenthash].css',
            }),
          ]
    ),

    // Determine how modules within the project are treated
    module: {
      rules: [
        // Typescript: Use TS Loader to transpile TypeScript files
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        },

        // JavaScript: Use Babel to transpile JavaScript files
        { test: /\.jsx?$/, use: ['babel-loader'] },

        // Styling files: (css;scss)

        // Images: Copy image files to build folder
        { test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i, type: 'asset/resource' },

        // Fonts: Inline files
        { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },

        // regular scss files
        {
          test: /\.scss$/i,
          exclude: /\.module\.scss$/i,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode,
                importLoaders: 1,
                modules: {
                  mode: 'icss',
                  auto: true,
                  localIdentName: isDevMode ? '[name]__[local]' : '[hash:base64]',
                  localIdentHashSalt: 'templatereactsasssite',
                },
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode,
                sassOptions: {
                  outputStyle: 'compressed',
                  importer: customJsonImporter(
                    `${env.themeFolder}`,
                    `${paths.src}/styles/theme/themes.json`
                  )(),
                },
              },
            },
          ],
        },

        // (s)css module files
        {
          test: /\.module\.scss$/i,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode,
                importLoaders: 1,
                modules: {
                  mode: 'local',
                  auto: true,
                  localIdentName: isDevMode ? '[name]__[local]' : '[hash:base64]',
                  localIdentHashSalt: 'templatereactsasssite',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode,
                sassOptions: {
                  outputStyle: 'compressed',
                },
              },
            },
          ],
        },
      ],
    },

    resolve: {
      modules: [paths.src, 'node_modules'],
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    },
  };
}

// export default createConfiguration;

export default function createMergedConfiguration(
  createConfiguration: CreateConfiguration
): CreateConfiguration {
  return function createUnifiedConfiguration(env: EnvArgs): Configuration {
    return merge(createCommonConfiguration(env), createConfiguration(env), ...getAddons(env.addon));
  };
}
*/

/*
 "@babel/core": "^7.17.9",
    "@babel/preset-env": "^7.16.11",
    "@babel/preset-react": "^7.16.7",
    "@babel/preset-typescript": "^7.16.7",
    "@babel/runtime": "^7.17.9",
    "@types/dotenv-webpack": "^7.0.3",
    "@types/fork-ts-checker-webpack-plugin": "^0.4.5",
    "@types/mini-css-extract-plugin": "^2.5.1",
    "@types/postcss-preset-env": "^6.7.3",
    "@types/react": "^17.0.44",
    "@types/react-dom": "^18.0.0",
    "@types/rimraf": "^3.0.2",
    "@types/uuid": "^8.3.4",
    "@types/webpack-bundle-analyzer": "^4.4.1",
    "@typescript-eslint/eslint-plugin": "^5.21.0",
    "@typescript-eslint/parser": "^5.21.0",
    "autoprefixer": "^10.4.7",
    "babel-loader": "^8.2.5",
    "clean-webpack-plugin": "^4.0.0",
    "copy-webpack-plugin": "^10.2.4",
    "css-loader": "^6.7.1",
    "dotenv-webpack": "^7.1.0",
    "eslint": "^8.14.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.5.0",
    "eslint-import-resolver-alias": "^1.1.2",
    "eslint-import-resolver-typescript": "^2.7.1",
    "eslint-import-resolver-webpack": "^0.13.2",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-jsx-a11y": "^6.5.1",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.29.4",
    "eslint-plugin-react-hooks": "^4.4.0",
    "eslint-webpack-plugin": "^3.1.1",
    "fork-ts-checker-webpack-plugin": "^7.2.7",
    "html-webpack-plugin": "^5.5.0",
    "jest": "^27.5.1",
    "mini-css-extract-plugin": "^2.6.0",
    "node-sass": "^7.0.1",
    "node-sass-json-importer": "^4.3.0",
    "postcss-loader": "^6.2.1",
    "postcss-preset-env": "^7.5.0",
    "prettier": "^2.6.2",
    "rimraf": "^3.0.2",
    "sass": "^1.51.0",
    "sass-loader": "^12.6.0",
    "style-loader": "^3.3.1",
    "ts-jest": "^27.1.4",
    "ts-loader": "^9.2.8",
    "ts-node": "^10.7.0",
    "tsconfig-paths-webpack-plugin": "^3.5.2",
    "typescript": "^4.6.3",
    "webpack": "^5.72.0",
    "webpack-bundle-analyzer": "^4.5.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.8.1",
    "webpack-merge": "^5.8.0"
*/
