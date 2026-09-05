import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";
import vitest from "ultracite/oxlint/vitest";

const jsPlugins = selectJsPlugins(["react-doctor", "sonarjs"]);

export default defineConfig({
  extends: [
    core,
    react,
    tanstack,
    vitest,
    tanstackJsPlugins,
    antiSlop,
    jsPlugins,
  ],
  ignorePatterns: core.ignorePatterns,
  jsPlugins: jsPlugins.jsPlugins,
  settings: jsPluginSettings,
});
