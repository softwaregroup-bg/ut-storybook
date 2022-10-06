const lazy = /primereact[/\\]resources[/\\]themes[/\\].+\.css$/i;
const {dirname} = require('path');

module.exports = {
    // TODO consider https://www.npmjs.com/package/neutrino-middleware-storybook
    webpackFinal: (config) => {
        const cssRule = config.module.rules.findIndex(rule => rule && rule.test && rule.test.toString() === '/\\.css$/');
        if (cssRule > -1) {
            config.module.rules.splice(cssRule, 0, {
                test: lazy,
                use: [{
                    loader: config.module.rules[cssRule].use[0].loader || config.module.rules[cssRule].use[0],
                    options: {
                        injectType: 'lazyStyleTag'
                    }
                }, {
                    loader: config.module.rules[cssRule].use[1].loader
                }]
            });
        }
        config.module.rules.unshift({
            test: /tesseract\.js\/dist\/|tesseract\.js-core\//,
            use: [{
                loader: require.resolve('file-loader'),
                options: {
                    outputPath: 'tesseract'
                }
            }]
        });
        config.module.rules.unshift({
            test: /\.traineddata\.gz/,
            use: [{
                loader: require.resolve('file-loader'),
                options: {
                    name: '[contenthash].traineddata.gz',
                    outputPath: 'tesseract'
                }
            }]
        });
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });
        config.module.rules.forEach(rule => {
            if (rule.exclude && rule.exclude.toString() === '/node_modules/') {
                rule.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
                rule.include.push(/node_modules[\\/]ut-/i);
            }
            if (rule && rule.test && rule.test.toString() === '/\\.css$/') {
                rule.exclude = lazy;
                rule.use[1].options = rule.use[1].options || {};
                rule.use[1].options.modules = rule.use[1].options.modules || {};
                rule.use[1].options.modules.auto = /\.module\.css$/;
            }
        });
        // config.module.rules.push({
        //     test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        //     exclude: /@babel(?:\/|\\{1,2})runtime/,
        //     enforce: "pre",
        //     use: ["source-map-loader"]
        // });
        // config.devtool = 'source-map';
        config.plugins.forEach(plugin => {
            if (plugin?.options?.exclude?.toString().startsWith('/node_modules/')) {
                plugin.options.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
            }
        });
        config.watchOptions = {
            ignored: /node_modules[\\/](?!(impl|ut)-)|\.git[\\/]/
        };
        config.optimization.concatenateModules = false;
        const empty = require.resolve('./empty');
        config.resolve.alias['dtrace-provider'] = empty;
        config.resolve.alias.fs = empty;
        config.resolve.alias['safe-json-stringify'] = empty;
        config.resolve.alias.mv = empty;
        config.resolve.alias['source-map-support'] = empty;
        config.resolve.alias.bufferutil = empty;
        config.resolve.alias['@storybook/react'] = dirname(require.resolve('@storybook/react/package.json'));
        config.resolve.alias['@mdx-js/react'] = dirname(require.resolve('@mdx-js/react/package.json'));
        config.resolve.alias['@storybook/addon-docs'] = dirname(require.resolve('@storybook/addon-docs/package.json'));
        config.resolve.alias['@storybook/addon-actions'] = dirname(require.resolve('@storybook/addon-actions/package.json'));
        config.resolve.alias['@storybook/testing-library'] = dirname(require.resolve('@storybook/testing-library/package.json'));
        return config;
    },
    reactOptions: {
        fastRefresh: true
    },
    typescript: {
        check: false,
        reactDocgen: 'react-docgen-typescript'
    },
    features: {
        // storyStoreV7: true,
        // buildStoriesJson: true,
        postcss: false
    },
    stories: [process.cwd().replace(/\\/g, '/') + '/@(portal|src)/**/*.stories.@(js|tsx|mdx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-storysource'
    ],
    // core: { builder: "@storybook/builder-vite" },
    async viteFinal(config) {
        config.server.fs.strict = false;
        config.root = process.cwd();
        return config;
    }
};
