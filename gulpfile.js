'use strict';

const build = require('@microsoft/sp-build-web');

// Suprimir warnings de CSS não camelCase
build.addSuppression(/Warning - \[sass\] The local CSS class .* is not camelCase and will not be type-safe\./);
build.addSuppression(`Warning - [package-solution] Admins can make this solution available to all sites immediately, but the solution also contains feature.xml elements for provisioning. Feature.xml elements are not automatically applied unless the solution is explicitly installed on a site.`);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../fonts/'
        }
      },
      exclude: /node_modules/,
    });
    return generatedConfiguration;
  },
});

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

build.lintCmd.enabled = false;

build.initialize(require('gulp'));
