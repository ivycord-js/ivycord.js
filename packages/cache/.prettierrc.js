/** @type {import("prettier").Config | import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const rootPrettierConfig = require('../../.prettierrc.js');
module.exports = {
  ...rootPrettierConfig
};
