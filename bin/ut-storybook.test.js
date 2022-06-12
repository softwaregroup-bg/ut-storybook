const tap = require('tap');

tap.test('require', async(assert) => {
    assert.ok(require('./ut-storybook'), 'require');
});
