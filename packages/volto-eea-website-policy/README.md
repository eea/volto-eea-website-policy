# @eeacms/volto-eea-website-policy

[![Releases](https://img.shields.io/github/v/release/eea/volto-eea-website-policy)](https://github.com/eea/volto-eea-website-policy/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-website-policy%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-website-policy/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-eea-website-policy&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-eea-website-policy)

EEA Main Website (Plone 6) [Volto](https://github.com/plone/volto) Frontend Policy

## Upgrade

### Upgrading to 5.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

The routes, the `manage-translations` view, the error view and the `eea.*` settings are unchanged. The published package now lives in `packages/volto-eea-website-policy`.

#### Changes on Volto 19

- **Related items stay hidden** below the body (`showRelatedItems: false`), which is the Volto 18 default; Volto 19 turns them on.
- **Autosave is enabled** for edit forms in the browser (`experimental.saveAsDraft`), which Volto 19 ships disabled.
- **Multilingual settings are read from the backend**; `isMultilingual` and `defaultLanguage` are only set on Volto 18.
- The HTML block's buttons declare `type="button"`, so they no longer submit the surrounding form.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`).
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers.

## Features

* Policy Volto add-on for EEA Main Website

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-eea-website-policy": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-eea-website-policy'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
