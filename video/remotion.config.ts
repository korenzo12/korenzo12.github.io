import { Config } from "@remotion/cli/config";
import path from "node:path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
Config.setChromiumOpenGlRenderer("angle");
Config.setEntryPoint("./src/index.ts");

Config.overrideWebpackConfig((current) => ({
  ...current,
  resolve: {
    ...current.resolve,
    alias: {
      ...(current.resolve?.alias ?? {}),
      "@": path.resolve(process.cwd(), "src"),
    },
  },
}));
