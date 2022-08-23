import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import styles from "rollup-plugin-styles";
import visualizer from "rollup-plugin-visualizer";
import copy from "rollup-plugin-copy";
import license from "rollup-plugin-license";
import dts from "rollup-plugin-dts";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import json from "@rollup/plugin-json";
// import { eslint } from 'rollup-plugin-eslint';
// import stylelint from 'rollup-plugin-stylelint';
// import sassLint from 'rollup-plugin-sass-lint';
// import generatePackageJson from 'rollup-plugin-generate-package-json';
// import livereload from 'rollup-plugin-livereload';
import { checkIfDevMode, getFilesFromDirectory } from "./scripts/build-utils";

const isDev = checkIfDevMode();
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const excludeExtensions = [".stories.tsx", ".stories.ts", ".stories.js"];
const packageJson = require("./package.json");
const banner = ["/*!", packageJson.name, packageJson.version, "*/\n"].join(" ");

export default [
  {
    input: [
      "src/index.ts",
      ...["src/components", "src/hooks", "src/utils"]
        .map((dir) => getFilesFromDirectory(dir, extensions, excludeExtensions))
        .reduce((prev, curr) => [...prev, ...curr], []),
    ],
    external: [...Object.keys(packageJson.devDependencies)],
    output: [
      /*{
        dir: "lib/cjs", //packageJson.main,
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        // name: "thedevdesigner-react-lib",
      },*/
      {
        dir: "lib/esm", //packageJson.module,
        format: "esm",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        // name: "thedevdesigner-react-lib",
      },
    ],
    plugins: [
      license({ banner }),
      copy({
        targets: [
          {
            src: "src/styles",
            dest: "lib/esm",
          },
        ],
        // useful in watch mode
        copyOnce: isDev,
      }),
      external({ includeDependencies: isDev }),
      resolve(),
      commonjs({ sourceMap: isDev }),
      /*
        stylelint({
    fix: false,
    include: ['src/**.scss'],
    syntax: 'scss',
    quiet: false
  }),
  eslint(),
      */
      babel({
        exclude: "node_modules/**",
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        compilerOptions: {
          outDir: "lib/esm",
        },
      }), // { useTsconfigDeclarationDir: true }
      /*alias({
        resolve: extensions.concat([".json"]),
        entries: [{ find: "src", replacement: "./src" }],
      }),*/
      styles({
        inject: false,
        autoModules: true,
        extensions: [".scss"],
        minimize: !isDev,
        sourceMap: isDev,
        use: ["sass"],
        sass: {
          // importer: //
          plugins: [autoprefixer, !isDev ? cssnano() : undefined],
        },
      }),
      json(),
      !isDev && terser(),
      // isDev &&
      //   livereload({
      //     watch: "public",
      //   }),
      isDev &&
        visualizer({
          filename: "bundle-analysis.html",
          open: true,
        }),
    ],
  },
  {
    input: "lib/esm/index.d.ts",
    output: [{ file: packageJson.types, format: "esm" }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()],
  },
];
