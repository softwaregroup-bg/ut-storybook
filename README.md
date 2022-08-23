# UT Storybook

This module is intended to be installed globally and used
through the CLI or the npm scripts.
It includes common Storybook configuration for use by
UT modules during development and build.

## CLI

```text
Usage: ut-storybook [options] [command]

Options:
  -h, --help      display help for command

Commands:
  start           Start the storybook
  build           Build the storybook
  publish         Publish the storybook (at chromatic.com)
  help [command]  display help for command
```

## npm scripts

A common pattern is to include `ut-storybook` calls in these
scripts in the package.json file:

```json
{
  "scripts": {
    "storybook": "ut-storybook start -p 6006 --ci",
    "version": "node build && ut-storybook build && ut-storybook publish && git add handlers.d.ts && ut-version",
    "review": "node build && ut-storybook build && ut-storybook publish"
  }
}
```

## Configuration

Put a file named `.ut_portal_devrc` in one of the standard rc places to
configure proxying of storybook requests to a local or other backend.

Example:

```yaml
proxy:
    /rpc/card:
        target: https://example.com
        logLevel: debug
        changeOrigin: true
        headers:
            Authorization: Bearer eyJra...
    /rpc:
        target: http://localhost:8090
        logLevel: debug
        changeOrigin: true
        headers:
            Authorization: Bearer eyJra...
    /api:
        target: http://localhost:8090
        logLevel: debug
        changeOrigin: true
    /aa:
        target: https://example.com
        logLevel: debug
        changeOrigin: true
        headers:
            cookie: ut-bus-asset=eyJra...
```

To make use of a real back end, you need to turn off using mocks in
`portal/config.js` (set storybook.backend.mock to false)

The two main use cases for proxying are:

1. If you use a backend API, which is already functional and deployed somewhere,
   you can point to it and not run a local back end.
2. If you are still developing the back end, point this file to localhost and
   run the back end separately to the storybook.

---
If you are interested in how this is implemented or for advanced usage, look
here: [.storybook/middleware.js](.storybook/middleware.js)
