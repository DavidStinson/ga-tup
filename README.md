# GA-Tup

GA-Tup, pronounced "tee-up", is a tool to help migrate General Assembly's modular tech content from v1 to v2 of the template.

## Installation

GA-Tup should be installed globally using npm:

```bash
npm i -g ga-tup
```

## Necessary dependencies

To fully migrate templates, you will need to also install [pkl](https://pkl-lang.org/main/current/introduction/index.html).

On macOS, you can install pkl using homebrew:

```bash
brew install pkl
```

## Usage

To see a list of all available commands, run:

```bash
ga-tup --help
```

To see more details and options for a specific command, run:

```bash
ga-tup <command> --help
```

Replacing `<command>` (including the `<` and `>`) with the command you need more help with. For example:

```bash
ga-tup update --help
```

## Need help? Find a bug?

File an [issue](https://github.com/DavidStinson/ga-tup/issues). Thanks for your help!

## Release process

1. Ensure you have the latest changes on the `main` branch in your local branch, and that your working tree is clean.
2. Run the CI process with `npm run ci` to ensure you'll be able to publish successfully. If any changes need to be made, do so and ensure those changes are merged to `main` and brought into your local `main` branch.
3. Run `npx changeset` to create a new changeset. This groups any changes into a single versioned release. Follow the prompts.
4. Run `npm run local-release` which will run the CI process, bump the package version, and publish all changes to npm.
5. Inform any stakeholders that a new version has been released. They can update with `npm i -g ga-tup`.
