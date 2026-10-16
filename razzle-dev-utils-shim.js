/**
 * Volto 19 moved razzle-dev-utils to @plone/razzle-dev-utils, but published
 * add-ons (e.g. @eeacms/volto-eea-chatbot <= 4.1.5) still require the legacy
 * 'razzle-dev-utils/makeLoaderFinder', which pnpm's strict node_modules does
 * not expose, so the Volto 19 build fails while loading the add-on's
 * razzle.extend.js.
 *
 * Shims the legacy name to the Volto core package at install time. Remove
 * this script once the fixed chatbot release is out.
 */
const fs = require('fs');
const path = require('path');

try {
  const root = __dirname;
  const target = path.join(root, 'core', 'packages', 'volto-razzle-dev-utils');
  const link = path.join(root, 'node_modules', 'razzle-dev-utils');

  if (
    fs.existsSync(path.join(target, 'makeLoaderFinder.js')) &&
    !fs.existsSync(link)
  ) {
    fs.symlinkSync(target, link, 'dir');
    console.log(`razzle-dev-utils shim: ${link} -> ${target}`);
  }
} catch (error) {
  console.warn(`razzle-dev-utils shim skipped: ${error.message}`);
}
