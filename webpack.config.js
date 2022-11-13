const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const commonFiles = ["script.js", "options.js", "options.html"];

const copyPluginCommonFilesPatterns = commonFiles.map((commonFile) => [
    {
        from: `./src/${commonFile}`,
        to: "./chrome",
    },
    {
        from: `./src/${commonFile}`,
        to: "./firefox",
    },
]).flat();

const copyPluginManifestsPatterns = [
    {
        from: "./src/manifest_V3.json",
        to: "./chrome/manifest.json",
    },
    {
        from: "./src/manifest_V2.json",
        to: "./firefox/manifest.json",
    },
];

module.exports = {
    entry: {},
    output: {},
    mode: 'none',

    plugins: [
        new CopyPlugin({
            patterns: [].concat(copyPluginCommonFilesPatterns, copyPluginManifestsPatterns)
        }),
    ],
};
