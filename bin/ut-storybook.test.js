const tap = require('tap');

tap.test('require', async(assert) => {
    process.argv.push('test');
    assert.ok(require('./ut-storybook'), 'require');
});
