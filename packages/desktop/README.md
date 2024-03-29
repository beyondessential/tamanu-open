# tamanu-desktop

### A Desktop application for Tamanu.

## Install

- **Note: requires a node version >= 7 and an npm version >= 4.**
- **If you have installation or compilation issues with this project, please see [our debugging guide](https://github.com/chentsulin/electron-react-boilerplate/issues/400)**

First, clone the repo via git:

```bash
git clone https://github.com/beyondessential/tamanu.git
```

And then install dependencies with yarn.

```bash
$ cd tamanu/packages/desktop
$ yarn
```

## Run

Start the app in the `dev` environment

```bash
$ yarn dev
```

Alternatively, you can run the renderer and main processes separately. This way, you can restart one process without waiting for the other. Run these two commands **simultaneously** in different console tabs:

```bash
$ yarn start-renderer-dev
$ yarn start-main-dev
```

If you don't need autofocus when your files was changed, then run `dev` with env `START_MINIMIZED=true`:

```bash
$ START_MINIMIZED=true yarn dev
```

## Storybook

We use storybook to develop a lot of our common UI components in isolation. To run storybook, use:

```
yarn storybook
```

## Packaging

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package -- --[option]
```

To run End-to-End Test

```bash
$ yarn build
$ yarn test-e2e

# Running e2e tests in a minimized window
$ START_MINIMIZED=true yarn build
$ yarn test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:

```bash
DEBUG_PROD=true yarn package
```

## Updates

TL;DR To release a new version of the desktop app for a country, simply make a branch `release-desktop-fiji`, edit the version in `package.json`, commit and push. Codeship and electron-builder will take care of the rest; your update should be downloaded by all internet-connected desktop clients in that country within 2 hours, and will be installed when the user next closes the app.

We use electron-builder's inbuilt autoupdate handling to make releasing app updates a breeze. See https://www.electron.build/auto-update for background.

Our specific process is slightly custom to allow releasing to different countries at different times. We use S3 as the "provider", and use a folder within `tamanu-builds/desktop` for each country, e.g. `tamanu-builds/desktop/fiji`

This folder contains a file called `latest.yml`, which is generated by `electron-builder`. Each desktop client will pull this file every hour and check whether it shows a new version is available - if it does, the client will download that new version and notify the user that it will be installed next time they close the app.

The country's folder will also contain `Tamanu Setup.exe` - this is all that needs to be downloaded to install Tamanu Desktop. Once installed, the app has an internal file called `app-updates.yml`, which tells it which S3 bucket and path to check for updates. `electron-builder` takes care of this internal file for us, so as long as the S3 buckets aren't manually messed with, an app downloaded from e.g. Fiji's folder will automatically receive any updates built into that folder.

Any time a `release-desktop-xxx` style branch triggers a codeship build, the build artifacts will be pushed to a folder in S3 based on the branch name, in this case `xxx`. Usually `xxx` will be "internal-testing", or a country's name e.g. "fiji". However, any other term can be used to generate a build for more specific testing - just branch off of your feature branch, and use the same branch name prefixed with `release-desktop-`

When setting up a new country, just follow the same process as for releasing a build to the country, and make sure all desktop app installs use the `.exe` from the new folder in S3 that is created by CI/CD.

## Versioning

Tamanu Desktop follows semver. When updating the version, please update both `desktop/package.json` and `desktop/app/package.json` (the latter is used by `electron-builder`).

## References

- [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
