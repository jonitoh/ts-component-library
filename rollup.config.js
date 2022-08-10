import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
// import postcss from "rollup-plugin-postcss";
import styles from "rollup-plugin-styles";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        // name: "thedevdesigner-react-lib",
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
      styles({
        modules: true,
        autoModules: true,
        extensions: [".css", ".scss"],
        minimize: false, // isDev
        sourceMap: false, // isDev
        use: ["sass"],
        sass: {
          // importer: //
        },
      }),
      // postcss(),
      terser(),
    ],
  },
  {
    input: "lib/esm/index.d.ts",
    output: [{ file: "lib/index.d.ts", format: "esm" }],
    external: [/\.css$/, /\.scss$/],
    plugins: [dts()],
  },
];
