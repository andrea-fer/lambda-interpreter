import typescript from "rollup-plugin-ts"
import {lezer} from "@lezer/generator/rollup"

export default {
  input: "src/lang-lambda/index.ts",
  external: id => id != "tslib" && !/^(\.?\/|\w:)/.test(id),
  output: [
    {file: "src/lang-lambda/index.cjs", format: "cjs"},
    {dir: "./src/lang-lambda", format: "es"}
  ],
  plugins: [lezer(), typescript()]
}
