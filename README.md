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
