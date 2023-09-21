import { Plugin } from "../plugin";
import { esbuildTransformPlugin } from "./esbuild";
import { importAnalysisPlugin } from "./importAnalysis";
import { resolvePlugin } from "./resolve";
import { cssPlugin } from "./css";
import { assetPlugin } from "./assets";

export function resolvePlugins(): Plugin[] {
  return [
    resolvePlugin(),
    esbuildTransformPlugin(),
    importAnalysisPlugin(),
    cssPlugin(),
    assetPlugin(),
  ];
}
